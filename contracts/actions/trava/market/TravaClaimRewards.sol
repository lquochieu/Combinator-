// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../interfaces/IWBNB.sol";
import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaHelper.sol";

/// @title Claim Rewards a token from an Trava market based on market
contract TravaClaimRewards is ActionBase, TravaHelper {
    using TokenUtils for address;

    /**
   * @dev Claims reward for an user, on all the assets of the lending pool, accumulating the pending rewards
   * @param amount Amount of rewards to claim
   * @param to Address that will be receiving the rewards
   * @param from DSProxy's user
   * @return Rewards claimed
   **/
    struct Params {
        address[] assets;
        uint256 amount;
        address to;
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

        uint256 nAsset = params.assets.length;
        for(uint256 i = 0; i < nAsset; i++) {
                params.assets[i] = _parseParamAddr(
                    params.assets[i],
                    _paramMapping[i],
                    _subData,
                    _returnValues
                );
        }
        params.amount = _parseParamUint(
            params.amount,
            _paramMapping[nAsset],
            _subData,
            _returnValues
        );
        params.to = _parseParamAddr(
            params.to,
            _paramMapping[nAsset + 1],
            _subData,
            _returnValues
        );
        params.from = _parseParamAddr(
            params.from,
            _paramMapping[nAsset + 2],
            _subData,
            _returnValues
        );


        (uint256 amount, bytes memory logData) = _claimRewards(
            params.assets,
            params.amount,
            params.to,
            params.from
        );
        emit ActionEvent("TravaClaimRewards", logData);
        return bytes32(amount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _claimRewards(
            params.assets,
            params.amount,
            params.to,
            params.from
        );
        logger.logActionDirectEvent("TravaClaimRewards", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////
    function _claimRewards(
        address[] memory _asset,
        uint256 _amount,
        address _to,
        address _from
    ) internal returns (uint256, bytes memory) {
        ITravaIncentivesController controller = ITravaIncentivesController(INCENTIVES_ADDRESS);
        
        // withdraw underlying tokens from Trava and send _to address
        uint256 amount = controller.claimRewards(_asset, _amount, _to);

        bytes memory logData = abi.encode(
            _asset,
            _amount,
            _to,
            _from
        );
        return (amount, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
