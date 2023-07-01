// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "../../../utils/TokenUtils.sol";
import "./helpers/PancakeV3Helper.sol";

/// @title Supplies liquidity to a PancakeswapV3 position represented by TokenId
contract PancakeRemoveLiquidityV3 is ActionBase, PancakeV3Helper {
    using TokenUtils for address;

    struct Params {
        uint256 tokenId;
        uint128 liquidity;
        uint256 amount0Min;
        uint256 amount1Min;
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

        pancakeData.tokenId = _parseParamUint(
            pancakeData.tokenId,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        pancakeData.liquidity = uint128(
            _parseParamUint(
                pancakeData.liquidity,
                _paramMapping[1],
                _subData,
                _returnValues
            )
        );

        pancakeData.amount0Min = _parseParamUint(
            pancakeData.amount0Min,
            _paramMapping[2],
            _subData,
            _returnValues
        );
        pancakeData.amount1Min = _parseParamUint(
            pancakeData.amount1Min,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        pancakeData.deadline = _parseParamUint(
            pancakeData.deadline,
            _paramMapping[4],
            _subData,
            _returnValues
        );

        (uint256 amount0, , bytes memory logData) = _pancakeRemoveLiquidity(
            pancakeData
        );
        emit ActionEvent("PancakeRemoveLiquidityV3", logData);

        return bytes32(amount0);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory pancakeData = parseInputs(_callData);
        (, , bytes memory logData) = _pancakeRemoveLiquidity(pancakeData);
        logger.logActionDirectEvent("PancakeRemoveLiquidityV3", logData);
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
        returns (uint256 amount0, uint256 amount1, bytes memory logData)
    {
        INonfungiblePositionManager.DecreaseLiquidityParams
            memory params = INonfungiblePositionManager
                .DecreaseLiquidityParams({
                    tokenId: _pancakeData.tokenId,
                    liquidity: _pancakeData.liquidity,
                    amount0Min: _pancakeData.amount0Min,
                    amount1Min: _pancakeData.amount1Min,
                    deadline: _pancakeData.deadline
                });

        (amount0, amount1) = manager.decreaseLiquidity(params);

        logData = abi.encode(_pancakeData, amount0, amount1);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory pancakeData) {
        pancakeData = abi.decode(_callData, (Params));
    }
}
