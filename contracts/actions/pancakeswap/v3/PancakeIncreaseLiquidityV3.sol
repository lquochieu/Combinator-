// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "../../../utils/TokenUtils.sol";
import "./helpers/PancakeV3Helper.sol";

/// @title Supplies liquidity to a PancakeswapV3 position represented by TokenId
contract PancakeIncreaseLiquidityV3 is ActionBase,  PancakeV3Helper{
    using TokenUtils for address;

    struct Params {
        uint256 tokenId;
        uint256 amount0Desired;
        uint256 amount1Desired;
        uint256 amount0Min;
        uint256 amount1Min;
        uint256 deadline;
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

        pancakeData.tokenId = _parseParamUint(
            pancakeData.tokenId,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        pancakeData.amount0Desired = uint128(_parseParamUint(
            pancakeData.amount0Desired,
            _paramMapping[1],
            _subData,
            _returnValues
        ));

        pancakeData.amount1Desired = uint128(_parseParamUint(
            pancakeData.amount1Desired,
            _paramMapping[2],
            _subData,
            _returnValues
        ));

        pancakeData.amount0Min = _parseParamUint(
            pancakeData.amount0Min,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        pancakeData.amount1Min = _parseParamUint(
            pancakeData.amount1Min,
            _paramMapping[4],
            _subData,
            _returnValues
        );

        pancakeData.deadline = _parseParamUint(
            pancakeData.deadline,
            _paramMapping[5],
            _subData,
            _returnValues
        );
        
        pancakeData.from = _parseParamAddr(
            pancakeData.from,
            _paramMapping[6],
            _subData,
            _returnValues
        );

        (uint256 liquidity, , , bytes memory logData) = _pancakeIncreaseLiquidity(pancakeData);
        emit ActionEvent("PancakeIncreaseLiquidityV3", logData);
        return bytes32(liquidity);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory pancakeData = parseInputs(_callData);
        (, , , bytes memory logData) = _pancakeIncreaseLiquidity(pancakeData);
        logger.logActionDirectEvent("PancakeIncreaseLiquidityV3", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _pancakeIncreaseLiquidity(
        Params memory _pancakeData
    ) internal returns (uint128 liquidity, uint256 amount0, uint256 amount1, bytes memory logData) {

        // bytes memory _pancakeDataEncode = abi.encode(_pancakeData);
        // bytes memory data = abi.encodeWithSignature("mint(MintParams)", _pancakeDataEncode);
        address token0;
        address token1;

        (, , token0, token1, , , , , , , ,) = manager.positions(_pancakeData.tokenId);

        // fetch tokens from address
        uint amount0Pulled = token0.pullTokensIfNeeded(
            _pancakeData.from,
            _pancakeData.amount0Desired
        );
        uint amount1Pulled = token1.pullTokensIfNeeded(
            _pancakeData.from,
            _pancakeData.amount1Desired
        );

        // approve positionManager so it can pull tokens
        token0.approveToken(address(smartRouter), amount0Pulled);
        token1.approveToken(address(smartRouter), amount1Pulled);

        _pancakeData.amount0Desired = amount0Pulled;
        _pancakeData.amount1Desired = amount1Pulled;

        INonfungiblePositionManager.IncreaseLiquidityParams memory params = INonfungiblePositionManager.IncreaseLiquidityParams({
            tokenId: _pancakeData.tokenId,
            amount0Desired: _pancakeData.amount0Desired,
            amount1Desired: _pancakeData.amount1Desired,
            amount0Min: _pancakeData.amount0Min,
            amount1Min: _pancakeData.amount1Min,
            deadline: _pancakeData.deadline
        });

        (liquidity, amount0, amount1) = manager.increaseLiquidity(params);

        //send leftovers
       token0.withdrawTokens(
            _pancakeData.from,
            _pancakeData.amount0Desired - amount0
        );
       token1.withdrawTokens(
            _pancakeData.from,
            _pancakeData.amount1Desired - amount1
        );

        logData = abi.encode(_pancakeData, liquidity, amount0, amount1);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory pancakeData) {
        pancakeData = abi.decode(_callData, (Params));
    }
}
