// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../auth/AdminAuth.sol";
import "../interfaces/exchange/IUniswapRouter.sol";
import "../interfaces/IBotRegistry.sol";
import "./TokenUtils.sol";
import "../libs/ILib_AddressManager.sol";

/// @title Contract used to refill tx sending bots when they are low on bnb
contract BotRefills is AdminAuth {
    using TokenUtils for address;
    error WrongRefillCallerError();
    error NotAuthBotError();

    // IUniswapRouter internal router = IUniswapRouter(UNI_V2_ROUTER);
    ILib_AddressManager private libAddressManager;

    mapping(address => bool) public additionalBots;

    modifier isApprovedBot(address _botAddr) {
        if (!(IBotRegistry(libAddressManager.getAddress("BOT_REGISTRY_ADDRESS")).botList(_botAddr) || additionalBots[_botAddr])){
            revert NotAuthBotError();
        }

        _;
    }

    modifier isRefillCaller {
        if (msg.sender != libAddressManager.getAddress("refillCaller")){
            revert WrongRefillCallerError();
        }
        _;
    }

    constructor(address _libAddressManager) AdminAuth(_libAddressManager) {
        libAddressManager = ILib_AddressManager(_libAddressManager);
    }

    function refill(uint256 _bnbAmount, address _botAddress)
        public
        isRefillCaller
        isApprovedBot(_botAddress)
    {
        // check if we have enough wbnb to send
        uint256 wbnbBalance = IERC20(TokenUtils.WBNB_ADDR).balanceOf(libAddressManager.getAddress("feeAddr"));

        if (wbnbBalance >= _bnbAmount) {
            IERC20(TokenUtils.WBNB_ADDR).transferFrom(libAddressManager.getAddress("feeAddr"), address(this), _bnbAmount);

            TokenUtils.withdrawWbnb(_bnbAmount);
            payable(_botAddress).transfer(_bnbAmount);
        } else {
            address[] memory path = new address[](2);
            path[0] = libAddressManager.getAddress("DAI_ADDR");
            path[1] = TokenUtils.WBNB_ADDR;

            // get how much dai we need to convert
            uint256 daiAmount = getEth2Dai(_bnbAmount);

            IERC20(libAddressManager.getAddress("DAI_ADDR")).transferFrom(libAddressManager.getAddress("feeAddr"), address(this), daiAmount);
            libAddressManager.getAddress("DAI_ADDR").approveToken(libAddressManager.getAddress("UNI_V2_ROUTER"), daiAmount);

            // swap and transfer directly to botAddress
            IUniswapRouter(libAddressManager.getAddress("UNI_V2_ROUTER")).swapExactTokensForBNB(daiAmount, 1, path, _botAddress, block.timestamp + 1);
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
        path[1] = libAddressManager.getAddress("DAI_ADDR");

        daiAmount = IUniswapRouter(libAddressManager.getAddress("UNI_V2_ROUTER")).getAmountsOut(_bnbAmount, path)[1];
    }

    function setRefillCaller(address _newBot) public onlyOwner {
        libAddressManager.setAddress("refillCaller", _newBot);
    }

    function setFeeAddr(address _newFeeAddr) public onlyOwner {
        libAddressManager.setAddress("feeAddr", _newFeeAddr);
    }

    function setAdditionalBot(address _botAddr, bool _approved) public onlyOwner {
        additionalBots[_botAddr] = _approved;
    }

    receive() external payable {}
}
