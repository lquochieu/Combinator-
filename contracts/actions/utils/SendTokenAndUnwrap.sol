// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../utils/TokenUtils.sol";
import "../ActionBase.sol";

/// @title Helper action to send a token to the specified address and unwrap if wbnb address
contract SendTokenAndUnwrap is ActionBase {
    using TokenUtils for address;

    struct Params {
        address tokenAddr;
        address to;
        uint256 amount;
    }

    constructor(address _libAddressManager) ActionBase(_libAddressManager) {}
    
    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory inputData = parseInputs(_callData);

        inputData.tokenAddr = _parseParamAddr(
            inputData.tokenAddr,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        inputData.to = _parseParamAddr(
            inputData.to,
            _paramMapping[1],
            _subData,
            _returnValues
        );
        inputData.amount = _parseParamUint(
            inputData.amount,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        inputData.amount = _sendToken(
            inputData.tokenAddr,
            inputData.to,
            inputData.amount
        );

        return bytes32(inputData.amount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory inputData = parseInputs(_callData);

        _sendToken(inputData.tokenAddr, inputData.to, inputData.amount);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Sends a token to the specified addr, works with Eth also
    /// @dev If amount is type(uint).max it will send proxy balance
    /// @dev If wbnb address is set it will unwrap by default
    /// @param _tokenAddr Address of token, use 0xEeee... for bnb
    /// @param _to Where the tokens are sent
    /// @param _amount Amount of tokens, can be type(uint).max
    function _sendToken(
        address _tokenAddr,
        address _to,
        uint _amount
    ) internal returns (uint) {
        if (_amount == type(uint256).max) {
            _amount = _tokenAddr.getBalance(address(this));
        }

        // unwrap and send bnb
        if (_tokenAddr == TokenUtils.WBNB_ADDR) {
            TokenUtils.withdrawWbnb(_amount);
            _tokenAddr = TokenUtils.BNB_ADDR;
        }

        _tokenAddr.withdrawTokens(_to, _amount);

        return _amount;
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
