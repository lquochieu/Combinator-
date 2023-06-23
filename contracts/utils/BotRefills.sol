// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../auth/AdminAuth.sol";
import "../interfaces/exchange/IUniswapRouter.sol";
import "../interfaces/IBotRegistry.sol";
import "./TokenUtils.sol";
import "./helpers/UtilHelper.sol";

/// @title Contract used to refill tx sending bots when they are low on bnb
contract BotRefills is AdminAuth, UtilHelper {
    using TokenUtils for address;
    error WrongRefillCallerError();
    error NotAuthBotError();

    IUniswapRouter internal router = IUniswapRouter(UNI_V2_ROUTER);

    mapping(address => bool) public additionalBots;

    modifier isApprovedBot(address _botAddr) {
        if (!(IBotRegistry(BOT_REGISTRY_ADDRESS).botList(_botAddr) || additionalBots[_botAddr])){
            revert NotAuthBotError();
        }

        _;
    }

    modifier isRefillCaller {
        if (msg.sender != refillCaller){
            revert WrongRefillCallerError();
        }
        _;
    }

    function refill(uint256 _bnbAmount, address _botAddress)
        public
        isRefillCaller
        isApprovedBot(_botAddress)
    {
        // check if we have enough wbnb to send
        uint256 wbnbBalance = IERC20(TokenUtils.WBNB_ADDR).balanceOf(feeAddr);

        if (wbnbBalance >= _bnbAmount) {
            IERC20(TokenUtils.WBNB_ADDR).transferFrom(feeAddr, address(this), _bnbAmount);

            TokenUtils.withdrawWbnb(_bnbAmount);
            payable(_botAddress).transfer(_bnbAmount);
        } else {
            address[] memory path = new address[](2);
            path[0] = DAI_ADDR;
            path[1] = TokenUtils.WBNB_ADDR;

            // get how much dai we need to convert
            uint256 daiAmount = getEth2Dai(_bnbAmount);

            IERC20(DAI_ADDR).transferFrom(feeAddr, address(this), daiAmount);
            DAI_ADDR.approveToken(address(router), daiAmount);

            // swap and transfer directly to botAddress
            router.swapExactTokensForETH(daiAmount, 1, path, _botAddress, block.timestamp + 1);
        }
    }

    function refillMany(uint256[] memory _bnbAmounts, address[] memory _botAddresses) public {
        for(uint i = 0; i < _botAddresses.length; ++i) {
            refill(_bnbAmounts[i], _botAddresses[i]);
        }
    }

    /// @dev Returns Dai amount, given bnb amount based on uniV2 pool price
    function getEth2Dai(uint256 _bnbAmount) internal view returns (uint256 daiAmount) {
        address[] memory path = new address[](2);
        path[0] = TokenUtils.WBNB_ADDR;
        path[1] = DAI_ADDR;

        daiAmount = router.getAmountsOut(_bnbAmount, path)[1];
    }

    function setRefillCaller(address _newBot) public onlyOwner {
        refillCaller = _newBot;
    }

    function setFeeAddr(address _newFeeAddr) public onlyOwner {
        feeAddr = _newFeeAddr;
    }

    function setAdditionalBot(address _botAddr, bool _approved) public onlyOwner {
        additionalBots[_botAddr] = _approved;
    }

    receive() external payable {}
}
