// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "../../../utils/TokenUtils.sol";
import "./helpers/PancakeV2Helper.sol";

/// @title Supplies liquidity to a PancakeswapV3 position represented by TokenId
contract PancakeSwapV2 is ActionBase,  PancakeV2Helper{
    using TokenUtils for address;
    /// @param amountIn amount want to swap
    /// @param amountOutMin default = 0
    /// @param path[0]: address tokenA, path[1]: address tokenB
    struct Params {
        uint256 amountIn;
        uint256 amountOutMin;
        address[] path;
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

        uint256 t = 0;

        pancakeData.amountIn = _parseParamUint(
            pancakeData.amountIn,
            _paramMapping[0],
            _subData,
            _returnValues
        );

        pancakeData.amountOutMin = _parseParamUint(
            pancakeData.amountOutMin,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        t = pancakeData.path.length;
        for(uint256 i = 0; i < t; i++) {
            pancakeData.path[i] = _parseParamAddr(
                pancakeData.path[i],
                _paramMapping[2 + i],
                _subData,
                _returnValues
            );

        }

        pancakeData.to = _parseParamAddr(
            pancakeData.to,
            _paramMapping[t + 3],
            _subData,
            _returnValues
        );
        pancakeData.deadline = _parseParamUint(
            pancakeData.deadline,
            _paramMapping[t + 4],
            _subData,
            _returnValues
        );

        (uint256[] memory amount, bytes memory logData) = _pancakeSwap(pancakeData);
        emit ActionEvent("PancakeSwapV2", logData);

        bytes memory concatenatedBytes = new bytes(amount.length * 32);
        
        for (uint256 i = 0; i < amount.length; i++) {
            bytes32 elementBytes = bytes32(amount[i]);
            uint256 offset = i * 32;
            
            assembly {
                mstore(add(concatenatedBytes, offset), elementBytes)
            }
        }
        
        bytes32 result;
        
        assembly {
            result := mload(add(concatenatedBytes, 32))
        }

        return result;
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory pancakeData = parseInputs(_callData);
        (, bytes memory logData) = _pancakeSwap(pancakeData);
        logger.logActionDirectEvent("PancakeSwapV2", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _pancakeSwap(
        Params memory _pancakeData
    ) internal returns (uint256[] memory amount, bytes memory logData) {
        // fetch tokens from address
        uint amountPulled = _pancakeData.path[0].pullTokensIfNeeded(
            _pancakeData.path[0],
            _pancakeData.amountIn
        );

        // approve positionManager so it can pull tokens
        _pancakeData.path[0].approveToken(address(pancakeRouter), amountPulled);

        _pancakeData.amountIn = amountPulled;

        amount = pancakeRouter.swapExactTokensForETH(
            _pancakeData.amountIn,
            _pancakeData.amountOutMin,
            _pancakeData.path,
            _pancakeData.to,
            _pancakeData.deadline
        );
        
        //send leftovers
        _pancakeData.path[0].withdrawTokens(
            _pancakeData.path[0],
            _pancakeData.amountIn - amount[0]
        );

        logData = abi.encode(_pancakeData, amount);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory pancakeData) {
        pancakeData = abi.decode(_callData, (Params));
    }
}
