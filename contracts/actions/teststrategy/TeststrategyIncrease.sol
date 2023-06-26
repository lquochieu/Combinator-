// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../ActionBase.sol";
import "./helpers/TestStrategyHelper.sol";

contract TestStrategyIncrease is ActionBase, TestStrategyHelper {

    struct Params {
      uint val;
    }

    constructor(address _libAddressManager) ActionBase(_libAddressManager) {}

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.val = _parseParamUint(
            params.val,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        (uint256 currentVal, bytes memory logData) = _increaseVal(
            params.val
        );

        emit ActionEvent("IncreaseVal", logData);
        return bytes32(currentVal);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _increaseVal(
            params.val
        );
        logger().logActionDirectEvent("IncreaseVal", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Increase value of user by 1 in TestStrategy
    function _increaseVal(
        uint256 val
    ) internal returns (uint256, bytes memory) {
        uint currentVal = increaseValForUser(val);
        
        bytes memory logData = abi.encode(
          val
        );
        return (currentVal, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
