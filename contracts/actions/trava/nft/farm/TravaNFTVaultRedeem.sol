// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import {INFTCollection} from "../../../../interfaces/trava/nft/INFTCollection.sol";
import "../../../ActionBase.sol";
import "./helpers/TravaNFTVaultHelper.sol";

contract TravaNFTVaultRedeem is ActionBase, TravaNFTVaultHelper {
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

        (uint256 totalRewards, bytes memory logData) = _redeem(
            params.vault,
            params.from
        );
        emit ActionEvent("TravaNFTVaultClaimReard", logData);
        return bytes32(totalRewards);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _redeem(params.vault, params.from);
        logger.logActionDirectEvent("TravaNFTVaultRedeem", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _redeem(
        address _vault,
        address _from
    ) internal returns (uint256, bytes memory) {
        if (_from == address(0)) {
            _from = address(this);
        }

        INFTVault(_vault).redeem();

        uint256 totalRewards = _sendbackRewardTokens(_vault, _from);

        _sendbackNFTCollection(_vault, _from);

        bytes memory logData = abi.encode(_vault, _from);
        return (totalRewards, logData);
    }

    function _sendbackNFTCollection(address _vault, address _from) internal {
        uint256 tokenId = INFTVault(_vault).stakerNFT(address(this));

        INFTCollection(NFT_COLLECTION).approve(_from, tokenId);
        INFTCollection(NFT_COLLECTION).safeTransferFrom(
            address(this),
            _from,
            tokenId
        );
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
