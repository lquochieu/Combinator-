// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaGovernanceHelper.sol";

/// @title Supply a token to an Trava market
contract TravaGovernanceCreateLock is ActionBase, TravaGovernanceHelper {
    using TokenUtils for address;

    struct Params {
        address token;
        uint value;
        uint lock_duration;
        address to;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.token = _parseParamAddr(
            params.token,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.value = _parseParamUint(
            params.value,
            _paramMapping[1],
            _subData,
            _returnValues
        );
        
        params.lock_duration = _parseParamUint(
            params.lock_duration,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        params.to = _parseParamAddr(
            params.to,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        (uint tokenId, bytes memory logData) = _createLock(
            params.token,
            params.value,
            params.lock_duration,
            params.to
        );
        emit ActionEvent("TravaGovernanceCreateLock", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _createLock(
            params.token,
            params.value,
            params.lock_duration,
            params.to
        );
        logger.logActionDirectEvent("TravaGovernanceCreateLock", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _createLock(
        address token,
        uint value,
        uint lock_duration,
        address to
    ) internal returns (uint, bytes memory) {
        uint tokenId = IVotingEscrow(token).create_lock_for(
            token, 
            value,
            lock_duration,
            to
        );

        bytes memory logData = abi.encode(
            token,
            value,
            lock_duration,
            to
        );
        return (tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }

}
