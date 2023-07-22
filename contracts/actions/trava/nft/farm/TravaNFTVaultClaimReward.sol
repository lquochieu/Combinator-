// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "./helpers/TravaNFTVaultHelper.sol";

contract TravaNFTVaultClaimReward is ActionBase, TravaNFTVaultHelper {
    struct Params {
        address vault;
        address from;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.vault = _parseParamAddr(
            params.vault,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        (uint256 totalRewards, bytes memory logData) = _claimReward(
            params.vault,
            params.from
        );
        emit ActionEvent("TravaNFTVaultClaimReward", logData);
        return bytes32(totalRewards);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _claimReward(params.vault, params.from);
        logger.logActionDirectEvent("TravaNFTVaultClaimReward", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _claimReward(
        address _vault,
        address _from
    ) internal returns (uint256, bytes memory) {
        if (_from == address(0)) {
            _from = address(this);
        }
        INFTVault(_vault).claimReward();

        uint256 totalRewards = _sendbackRewardTokens(_vault, _from);

        bytes memory logData = abi.encode(_vault, _from);
        return (totalRewards, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
