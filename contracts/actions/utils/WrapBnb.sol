// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../utils/TokenUtils.sol";
import "../ActionBase.sol";

/// @title Helper action to wrap BNB to WBNB
contract WrapBnb is ActionBase {
    struct Params {
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

        inputData.amount = _parseParamUint(
            inputData.amount,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        return bytes32(_wrapBnb(inputData.amount));
    }

    // solhint-disable-next-line no-empty-blocks
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory inputData = parseInputs(_callData);

        _wrapBnb(inputData.amount);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Wraps native Bnb to WBNB token
    /// @param _amount Amount of bnb to wrap, if type(uint256).max wraps whole balance
    function _wrapBnb(uint256 _amount) internal returns (uint256) {
        if (_amount == type(uint256).max) {
            _amount = address(this).balance;
        }

        TokenUtils.depositWbnb(_amount);
        return _amount;
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
