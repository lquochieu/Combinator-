// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../utils/TokenUtils.sol";
import "../../ActionBase.sol";
import "./helpers/TravaStakingHelper.sol";
import "../../../utils/SafeBEP20.sol";

/// @title Supply a token to an Trava market
contract TravaStakingRedeem is ActionBase, TravaStakingHelper {
    // using TokenUtils for address;
    using SafeBEP20 for IBEP20;

    struct Params {
        address stakingPool;
        address to;
        uint256 amount;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);
        
        params.stakingPool = _parseParamAddr(
            params.stakingPool,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        params.to = _parseParamAddr(
            params.to,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.amount = _parseParamUint(
            params.amount,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        (uint256 stakeAmount, bytes memory logData) = _redeem(
            params.stakingPool,
            params.to,
            params.amount
        );
        emit ActionEvent("TravaStakingRedeem", logData);
        return bytes32(stakeAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _redeem(
            params.stakingPool,
            params.to,
            params.amount
        );
        logger.logActionDirectEvent("TravaStakingRedeem", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _redeem(
        address _stakingPool,
        address _to,
        uint256 _amount
    ) internal returns (uint256, bytes memory) {

        // default to onBehalf of proxy
        if (_to == address(0)) {
            _to = address(this);
        }

        // deposit in behalf of the proxy
        IStakedToken(_stakingPool).redeem(
            _to,
            _amount
        );

        address stakedToken = IStakedToken(_stakingPool).STAKED_TOKEN();

        if (_to == address(this)) {
            if (_amount == type(uint256).max) {
                _amount = IBEP20(stakedToken).balanceOf(address(this));
            }
            IBEP20(stakedToken).safeTransfer(_to, _amount);
        }

        bytes memory logData = abi.encode(
            _to,
            _amount
        );
        return (_amount, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }

}
