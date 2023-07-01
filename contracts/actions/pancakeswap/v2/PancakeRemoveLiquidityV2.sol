// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "../../../utils/TokenUtils.sol";
import "./helpers/PancakeV2Helper.sol";

/// @title Supplies liquidity to a PancakeswapV3 position represented by TokenId
contract PancakeRemoveLiquidityV2 is ActionBase, PancakeV2Helper {
    using TokenUtils for address;

    struct Params {
        address tokenA;
        address tokenB;
        uint256 liquidity;
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
        pancakeData.liquidity = _parseParamUint(
            pancakeData.liquidity,
            _paramMapping[2],
            _subData,
            _returnValues
        );
        pancakeData.amountAMin = _parseParamUint(
            pancakeData.amountAMin,
            _paramMapping[3],
            _subData,
            _returnValues
        );
        pancakeData.amountBMin = _parseParamUint(
            pancakeData.amountBMin,
            _paramMapping[4],
            _subData,
            _returnValues
        );
        pancakeData.to = _parseParamAddr(
            pancakeData.to,
            _paramMapping[5],
            _subData,
            _returnValues
        );
        pancakeData.deadline = _parseParamUint(
            pancakeData.deadline,
            _paramMapping[6],
            _subData,
            _returnValues
        );

        (
            uint256 amountA,
            ,
            bytes memory logData
        ) = _pancakeRemoveLiquidity(pancakeData);
        emit ActionEvent("PancakeRemoveLiquidityV2", logData);

        return bytes32(amountA);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory pancakeData = parseInputs(_callData);
        (
            ,
            ,
            bytes memory logData
        ) = _pancakeRemoveLiquidity(pancakeData);
        logger.logActionDirectEvent("PancakeRemoveLiquidityV2", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _pancakeRemoveLiquidity(
        Params memory _pancakeData
    )
        internal
        returns (uint256 amountA, uint256 amountB, bytes memory logData)
    {
        (amountA, amountB) = pancakeRouter.removeLiquidity(
            _pancakeData.tokenA,
            _pancakeData.tokenB,
            _pancakeData.liquidity,
            _pancakeData.amountAMin,
            _pancakeData.amountBMin,
            _pancakeData.to,
            _pancakeData.deadline
        );

        logData = abi.encode(_pancakeData, amountA, amountB);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory pancakeData) {
        pancakeData = abi.decode(_callData, (Params));
    }
}
