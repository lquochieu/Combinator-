// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "../../../utils/TokenUtils.sol";
import "./helpers/PancakeV3Helper.sol";

/// @title Supplies liquidity to a PancakeswapV3 position represented by TokenId
contract PancakeSwapV3 is ActionBase, PancakeV3Helper {
    using TokenUtils for address;
    /// @param amountIn amount want to swap
    /// @param amountOutMin default = 0
    /// @param path[0]: address tokenA, path[1]: address tokenB
    struct Params {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
        address from;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory pancakeData = parseInputs(_callData);

        pancakeData.tokenIn = _parseParamAddr(
            pancakeData.tokenIn,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        pancakeData.tokenOut = _parseParamAddr(
            pancakeData.tokenOut,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        pancakeData.fee = uint24(
            _parseParamUint(
                pancakeData.fee,
                _paramMapping[2],
                _subData,
                _returnValues
            )
        );

        pancakeData.recipient = _parseParamAddr(
            pancakeData.recipient,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        pancakeData.amountIn = _parseParamUint(
            pancakeData.amountIn,
            _paramMapping[4],
            _subData,
            _returnValues
        );

        pancakeData.amountOutMinimum = _parseParamUint(
            pancakeData.amountOutMinimum,
            _paramMapping[5],
            _subData,
            _returnValues
        );

        pancakeData.sqrtPriceLimitX96 = uint160(
            _parseParamUint(
                pancakeData.sqrtPriceLimitX96,
                _paramMapping[6],
                _subData,
                _returnValues
            )
        );

        pancakeData.from = _parseParamAddr(
            pancakeData.from,
            _paramMapping[7],
            _subData,
            _returnValues
        );

        (uint256 amount, bytes memory logData) = _pancakeSwap(pancakeData);
        emit ActionEvent("PancakeSwapV3", logData);
        return bytes32(amount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory pancakeData = parseInputs(_callData);
        (, bytes memory logData) = _pancakeSwap(pancakeData);
        logger.logActionDirectEvent("PancakeSwapV3", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _pancakeSwap(
        Params memory _pancakeData
    ) internal returns (uint256 amount, bytes memory logData) {
        // // fetch tokens from address
        // uint amountPulled = _pancakeData.tokenIn.pullTokensIfNeeded(
        //     _pancakeData.from,
        //     _pancakeData.amountIn
        // );

        // approve positionManager so it can pull tokens
        _pancakeData.tokenIn.approveToken(address(smartRouter), _pancakeData.amountIn);

        // _pancakeData.amountIn = amountPulled;

        IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter
            .ExactInputSingleParams({
                tokenIn: _pancakeData.tokenIn,
                tokenOut: _pancakeData.tokenOut,
                fee: _pancakeData.fee,
                recipient: _pancakeData.recipient,
                amountIn: _pancakeData.amountIn,
                amountOutMinimum: _pancakeData.amountOutMinimum,
                sqrtPriceLimitX96: _pancakeData.sqrtPriceLimitX96
            });
        amount = smartRouter.exactInputSingle(params);

        logData = abi.encode(_pancakeData, amount);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory pancakeData) {
        pancakeData = abi.decode(_callData, (Params));
    }
}
