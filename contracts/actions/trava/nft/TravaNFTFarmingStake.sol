// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "./helpers/TravaNFTHelper.sol";

contract TravaNFTFarmingStake is ActionBase, TravaNFTHelper {

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

        (uint256 level, bytes memory logData) = _stake(
            params.ids,
            params.level,
            params.farming,
            params.from
        );
        emit ActionEvent("TravaNFTFarmingStake", logData);
        return bytes32(level);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _stake(
            params.ids,
            params.level,
            params.farming,
            params.from
        );
        logger.logActionDirectEvent("TravaNFTFarmingStake", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _stake(
        uint256[] memory _ids,
        uint128 _level,
        address _farming,
        address _from
    ) internal returns (uint256, bytes memory) {
        
        for(uint256 i = 0; i < _ids.length; i++) {
            if(INFTCore(NFT_CORE).ownerOf(_ids[i]) != address(this)) {
                require(
                    INFTCore(NFT_CORE).ownerOf(_ids[i]) == _from,
                    "Owner and smart wallet does not possess token "
                );

                INFTCore(NFT_CORE).transferFrom(_from, address(this), _ids[i]);
            }
        }
        IFarming(_farming).stake(_ids, _level);
        bytes memory logData = abi.encode(_ids, _level, _farming, _from);
        return (_level, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
