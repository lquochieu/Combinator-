// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "./helpers/TravaNFTHelper.sol";

contract TravaNFTFarmingRedeemAndClaim is ActionBase, TravaNFTHelper {

    struct Params {
        uint256[] ids;
        uint128 level;
        address farming;
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

        uint256 n = params.ids.length;

        for(uint256 i = 0; i < n; i++) {
            params.ids[i] = _parseParamUint(
                params.ids[i],
                _paramMapping[0],
                _subData,
                _returnValues
            );
        }
        params.level = uint128(_parseParamUint(
            params.level,
            _paramMapping[n],
            _subData,
            _returnValues
        ));

        params.farming = _parseParamAddr(
                params.farming,
                _paramMapping[n + 1],
                _subData,
                _returnValues
            );

        params.from = _parseParamAddr(
                params.from,
                _paramMapping[n + 2],
                _subData,
                _returnValues
            );

        (uint256 totalRewards, bytes memory logData) = _redeemAndClaim(
            params.ids,
            params.level,
            params.farming,
            params.from
        );
        emit ActionEvent("TravaNFTFarmingRedeemAndClaim", logData);
        return bytes32(totalRewards);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _redeemAndClaim(
            params.ids,
            params.level,
            params.farming,
            params.from
        );
        logger.logActionDirectEvent("TravaNFTFarmingRedeemAndClaim", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _redeemAndClaim(
        uint256[] memory _ids,
        uint128 _level,
        address _farming,
        address _from
    ) internal returns (uint256, bytes memory) {
        
        IFarming(_farming).redeemAndClaim(_ids, _level);

        for(uint256 i = 0; i < _ids.length; i++) {
                INFTCore(NFT_CORE).transferFrom(address(this), _from, _ids[i]);
        }

        uint256 totalRewards = IFarming(_farming).getTotalRewardsBalance(_ids);

        bytes memory logData = abi.encode(_ids, _level, _farming, _from);
        return (totalRewards, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
