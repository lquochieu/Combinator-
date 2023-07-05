// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;

import "../../ActionBase.sol";
import "../../../utils/TokenUtils.sol";
import "./helpers/PancakeV3Helper.sol";

/// @title Action for creating Pancakeswap V3 Pool and minting a position in it after that
/// @notice If pool already exists, it will only mint a position in pool
contract PancakeCreatePoolV3 is ActionBase, PancakeV3Helper {
    using TokenUtils for address;

    /// @param token0 The contract address of token0 of the pool
    /// @param token1 The contract address of token1 of the pool
    /// @param fee The fee amount of the v3 pool for the specified token pair
    /// @param tickLower The lower end of the tick range for the position
    /// @param tickUpper The higher end of the tick range for the position
    /// @param amount0Desired The desired amount of token0 that should be supplied
    /// @param amount1Desired The desired amount of token1 that should be supplied
    /// @param amount0Min The minimum amount of token0 that should be supplied,
    /// @param amount1Min The minimum amount of token1 that should be supplied,
    /// @param recipient address which will receive the NFT
    /// @param deadline The time by which the transaction must be included to effect the change
    /// @param from account to take amounts from
    /// @param sqrtPriceX96 The initial square root price of the pool as a Q64.96 value
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
        uint160 sqrtPriceX96;
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
        pancakeData.fee = uint24(
            _parseParamUint(
                pancakeData.fee,
                _paramMapping[2],
                _subData,
                _returnValues
            )
        );

        pancakeData.tickLower = int24(
            _parseParamInt(
                pancakeData.tickLower,
                _paramMapping[3],
                _subData,
                _returnValues
            )
        );

        pancakeData.tickUpper = int24(
            _parseParamInt(
                pancakeData.tickUpper,
                _paramMapping[4],
                _subData,
                _returnValues
            )
        );

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

        pancakeData.sqrtPriceX96 = uint160(
            _parseParamUint(
                pancakeData.sqrtPriceX96,
                _paramMapping[12],
                _subData,
                _returnValues
            )
        );

        _createPool(pancakeData);

        (uint256 tokenId, bytes memory logData) = _pancakeCreatePosition(
            pancakeData
        );
        emit ActionEvent("PancakeCreatePoolV3", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory pancakeData = parseInputs(_callData);

        _createPool(pancakeData);
        (, bytes memory logData) = _pancakeCreatePosition(pancakeData);
        logger.logActionDirectEvent("PancakeCreatePoolV3", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _createPool(Params memory _pancakeData) internal {
        manager.createAndInitializePoolIfNecessary(
            _pancakeData.token0,
            _pancakeData.token1,
            _pancakeData.fee,
            _pancakeData.sqrtPriceX96
        );
    }

    function _pancakeCreatePosition(
        Params memory _pancakeData
    ) internal returns (uint256 tokenId, bytes memory logData) {
        // fetch tokens from address;
        uint256 amount0Pulled = _pancakeData.token0.pullTokensIfNeeded(
            _pancakeData.from,
            _pancakeData.amount0Desired
        );
        uint256 amount1Pulled = _pancakeData.token1.pullTokensIfNeeded(
            _pancakeData.from,
            _pancakeData.amount1Desired
        );

        // approve manager so it can pull tokens
        _pancakeData.token0.approveToken(address(manager), amount0Pulled);
        _pancakeData.token1.approveToken(address(manager), amount1Pulled);

        _pancakeData.amount0Desired = amount0Pulled;
        _pancakeData.amount1Desired = amount1Pulled;

        uint128 liquidity;
        uint256 amount0;
        uint256 amount1;
        (tokenId, liquidity, amount0, amount1) = _pancakeMint(_pancakeData);

        //send leftovers
        _pancakeData.token0.withdrawTokens(
            _pancakeData.from,
            _pancakeData.amount0Desired - amount0
        );
        _pancakeData.token1.withdrawTokens(
            _pancakeData.from,
            _pancakeData.amount1Desired - amount1
        );

        logData = abi.encode(
            _pancakeData,
            tokenId,
            liquidity,
            amount0,
            amount1
        );
    }

    /// @dev mints new NFT that represents a position with selected parameters
    /// @return tokenId of new NFT, how much liquidity it now has and amount of tokens that were transferred to pancakeswap pool
    function _pancakeMint(
        Params memory _pancakeData
    )
        internal
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        )
    {
        INonfungiblePositionManager.MintParams
            memory mintParams = INonfungiblePositionManager.MintParams({
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
        (tokenId, liquidity, amount0, amount1) = manager.mint(mintParams);
    }

    function parseInputs(
        bytes memory _callData
    ) internal pure returns (Params memory inputData) {
        inputData = abi.decode(_callData, (Params));
    }
}
