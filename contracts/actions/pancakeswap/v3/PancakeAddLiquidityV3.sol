// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "../../../utils/TokenUtils.sol";
import "./helpers/PancakeV3Helper.sol";

/// @title Supplies liquidity to a PancakeswapV3 position represented by TokenId
contract PancakeAddLiquidityV3 is ActionBase,  PancakeV3Helper{
    using TokenUtils for address;

    struct Params {
        address token0;
        address token1;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        uint256 amount0Desired;
        uint256 amount1Desired;
        uint256 amount0Min;
        uint256 amount1Min;
        address recipient;
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

        pancakeData.token0 = _parseParamAddr(
            pancakeData.token0,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        pancakeData.token1 = _parseParamAddr(
            pancakeData.token1,
            _paramMapping[1],
            _subData,
            _returnValues
        );
        pancakeData.fee = uint24(_parseParamUint(
            pancakeData.fee,
            _paramMapping[2],
            _subData,
            _returnValues
        ));

        pancakeData.tickLower = int24(_parseParamInt(
            pancakeData.tickLower,
            _paramMapping[3],
            _subData,
            _returnValues
        ));

        pancakeData.tickUpper = int24(_parseParamInt(
            pancakeData.tickUpper,
            _paramMapping[4],
            _subData,
            _returnValues
        ));

        pancakeData.amount0Desired = _parseParamUint(
            pancakeData.amount0Desired,
            _paramMapping[5],
            _subData,
            _returnValues
        );

        pancakeData.amount1Desired = _parseParamUint(
            pancakeData.amount1Desired,
            _paramMapping[6],
            _subData,
            _returnValues
        );

        pancakeData.amount0Min = _parseParamUint(
            pancakeData.amount0Min,
            _paramMapping[7],
            _subData,
            _returnValues
        );

        pancakeData.amount1Min = _parseParamUint(
            pancakeData.amount1Min,
            _paramMapping[8],
            _subData,
            _returnValues
        );

        pancakeData.recipient = _parseParamAddr(
            pancakeData.recipient,
            _paramMapping[9],
            _subData,
            _returnValues
        );
        pancakeData.deadline = _parseParamUint(
            pancakeData.deadline,
            _paramMapping[10],
            _subData,
            _returnValues
        );

        pancakeData.from = _parseParamAddr(
            pancakeData.from,
            _paramMapping[11],
            _subData,
            _returnValues
        );
        
        (, uint256 liquidity, , , bytes memory logData) = _pancakeAddLiquidity(pancakeData);
        emit ActionEvent("PancakeAddLiquidityV3", logData);
        return bytes32(liquidity);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory pancakeData = parseInputs(_callData);
        (, , , , bytes memory logData) = _pancakeAddLiquidity(pancakeData);
        logger.logActionDirectEvent("PancakeAddLiquidityV3", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _pancakeAddLiquidity(
        Params memory _pancakeData
    ) internal returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1, bytes memory logData) {
        // // fetch tokens from address
        // uint amount0Pulled = _pancakeData.token0.pullTokensIfNeeded(
        //     _pancakeData.from,
        //     _pancakeData.amount0Desired
        // );
        // uint amount1Pulled = _pancakeData.token1.pullTokensIfNeeded(
        //     _pancakeData.from,
        //     _pancakeData.amount1Desired
        // );

        // approve positionManager so it can pull tokens
        _pancakeData.token0.approveToken(address(manager), _pancakeData.amount0Desired);
        _pancakeData.token1.approveToken(address(manager), _pancakeData.amount1Desired);

        // _pancakeData.amount0Desired = amount0Pulled;
        // _pancakeData.amount1Desired = amount1Pulled;

        // bytes memory _pancakeDataEncode = abi.encode(_pancakeData);
        // bytes memory data = abi.encodeWithSignature("mint(MintParams)", _pancakeDataEncode);
        
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: _pancakeData.token0,
            token1: _pancakeData.token1,
            fee: _pancakeData.fee,
            tickLower: _pancakeData.tickLower,
            tickUpper: _pancakeData.tickUpper,
            amount0Desired: _pancakeData.amount0Desired,
            amount1Desired: _pancakeData.amount1Desired,
            amount0Min: _pancakeData.amount0Min,
            amount1Min: _pancakeData.amount1Min,
            recipient: _pancakeData.recipient,
            deadline: _pancakeData.deadline
        });

        (tokenId, liquidity, amount0, amount1) = manager.mint(params);

        // //send leftovers
        // _pancakeData.token0.withdrawTokens(
        //     _pancakeData.from,
        //     _pancakeData.amount0Desired - amount0
        // );
        // _pancakeData.token1.withdrawTokens(
        //     _pancakeData.from,
        //     _pancakeData.amount1Desired - amount1
        // );

        logData = abi.encode(_pancakeData, tokenId, liquidity, amount0, amount1);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory pancakeData) {
        pancakeData = abi.decode(_callData, (Params));
    }
}
