// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "../../../utils/TokenUtils.sol";
import "./helpers/PancakeV2Helper.sol";

/// @title Supplies liquidity to a PancakeswapV3 position represented by TokenId
contract PancakeAddLiquidityV2 is ActionBase,  PancakeV2Helper{
    using TokenUtils for address;

    struct Params {
        address tokenA;
        address tokenB;
        uint256 amountADesired;
        uint256 amountBDesired;
        uint256 amountAMin;
        uint256 amountBMin;
        address to;
        uint256 deadline;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory pancakeData = parseInputs(_callData);

        pancakeData.tokenA = _parseParamAddr(
            pancakeData.tokenA,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        pancakeData.tokenB = _parseParamAddr(
            pancakeData.tokenB,
            _paramMapping[1],
            _subData,
            _returnValues
        );
        pancakeData.amountADesired = _parseParamUint(
            pancakeData.amountADesired,
            _paramMapping[2],
            _subData,
            _returnValues
        );
        pancakeData.amountBDesired = _parseParamUint(
            pancakeData.amountBDesired,
            _paramMapping[3],
            _subData,
            _returnValues
        );
        pancakeData.amountAMin = _parseParamUint(
            pancakeData.amountAMin,
            _paramMapping[4],
            _subData,
            _returnValues
        );
        pancakeData.amountBMin = _parseParamUint(
            pancakeData.amountBMin,
            _paramMapping[5],
            _subData,
            _returnValues
        );
        pancakeData.to = _parseParamAddr(
            pancakeData.to,
            _paramMapping[6],
            _subData,
            _returnValues
        );
        pancakeData.deadline = _parseParamUint(
            pancakeData.deadline,
            _paramMapping[7],
            _subData,
            _returnValues
        );

        (uint256 liquidity, bytes memory logData) = _pancakeAddLiquidity(pancakeData);
        emit ActionEvent("PancakeSwapV2", logData);
        return bytes32(liquidity);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory pancakeData = parseInputs(_callData);
        (, bytes memory logData) = _pancakeAddLiquidity(pancakeData);
        logger.logActionDirectEvent("PancakeSwapV2", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _pancakeAddLiquidity(
        Params memory _pancakeData
    ) internal returns (uint256 liquidity, bytes memory logData) {
        // fetch tokens from address
        uint amountAPulled = _pancakeData.tokenA.pullTokensIfNeeded(
            _pancakeData.tokenA,
            _pancakeData.amountADesired
        );
        uint amountBPulled = _pancakeData.tokenB.pullTokensIfNeeded(
            _pancakeData.tokenB,
            _pancakeData.amountBDesired
        );

        // approve positionManager so it can pull tokens
        _pancakeData.tokenA.approveToken(address(pancakeRouter), amountAPulled);
        _pancakeData.tokenB.approveToken(address(pancakeRouter), amountBPulled);

        _pancakeData.amountADesired = amountAPulled;
        _pancakeData.amountBDesired = amountBPulled;

        uint256 amountA;
        uint256 amountB;
        (amountA, amountB, liquidity) = pancakeRouter.addLiquidity(
            _pancakeData.tokenA,
            _pancakeData.tokenB,
            _pancakeData.amountADesired,
            _pancakeData.amountBDesired,
            _pancakeData.amountAMin,
            _pancakeData.amountBMin,
            _pancakeData.to,
            _pancakeData.deadline
        );

        //send leftovers
        _pancakeData.tokenA.withdrawTokens(
            _pancakeData.tokenA,
            _pancakeData.amountADesired - amountA
        );
        _pancakeData.tokenB.withdrawTokens(
            _pancakeData.tokenB,
            _pancakeData.amountBDesired - amountB
        );

        logData = abi.encode(_pancakeData, amountA, amountB, liquidity);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory pancakeData) {
        pancakeData = abi.decode(_callData, (Params));
    }
}
