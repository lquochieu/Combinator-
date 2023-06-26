// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../ActionBase.sol";
import "../../auth/ProxyPermission.sol";
import "../../utils/TokenUtils.sol";
import "../../core/strategy/SubStorage.sol";
import "../../core/strategy/StrategyModel.sol";
import "../../libs/ILib_AddressManager.sol";
/// @title Action to create a new subscription
contract CreateSub is ActionBase, ProxyPermission {
    /// @param _sub Subscription struct of the user (is not stored on chain, only the hash)
    struct Params {
        StrategyModel.StrategySub sub;
    }

    ILib_AddressManager private libAddressManager;
    constructor(address _libAddressManager) ActionBase(_libAddressManager) ProxyPermission(_libAddressManager) {}
    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory inputData = parseInputs(_callData);

        for (uint256 i = 0; i < inputData.sub.subData.length; i++) {
            inputData.sub.subData[i] = _parseParamABytes32(
                inputData.sub.subData[i],
                _paramMapping[i],
                _subData,
                _returnValues
            );
        }

        uint256 subId = createSub(inputData);

        return (bytes32(subId));
    }

    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory inputData = parseInputs(_callData);

        createSub(inputData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice Gives DSProxy permission if needed and registers a new sub
    function createSub(
        Params memory _inputData
    ) internal returns (uint256 subId) {
        givePermission(libAddressManager.getAddress("PROXY_AUTH_ADDR"));

        subId = SubStorage(libAddressManager.getAddress("SUB_STORAGE_ADDR")).subscribeToStrategy(
            _inputData.sub
        );
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
