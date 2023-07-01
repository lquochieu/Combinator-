// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "../../../utils/TokenUtils.sol";
import "./helpers/PancakeV3Helper.sol";

/// @title Supplies liquidity to a PancakeswapV3 position represented by TokenId
contract PancakeCollectV3 is ActionBase,  PancakeV3Helper{
    using TokenUtils for address;

    struct Params {
        uint256 tokenId;
        address recipient;
        uint128 amount0Max;
        uint128 amount1Max;
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
        pancakeData.recipient = _parseParamAddr(
            pancakeData.recipient,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        pancakeData.amount0Max = uint128(_parseParamUint(
            pancakeData.amount0Max,
            _paramMapping[2],
            _subData,
            _returnValues
        ));

        pancakeData.amount1Max = uint128(_parseParamUint(
            pancakeData.amount1Max,
            _paramMapping[3],
            _subData,
            _returnValues
        ));

        (uint256 amount0, , bytes memory logData) = _pancakeCollect(pancakeData);
        emit ActionEvent("PancakeCollectV3", logData);
        return bytes32(amount0);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory pancakeData = parseInputs(_callData);
        (, , bytes memory logData) = _pancakeCollect(pancakeData);
        logger.logActionDirectEvent("PancakeCollectV3", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _pancakeCollect(
        Params memory _pancakeData
    ) internal returns (uint256 amount0, uint256 amount1, bytes memory logData) {


        INonfungiblePositionManager.CollectParams memory params = INonfungiblePositionManager.CollectParams({
            tokenId: _pancakeData.tokenId,
            recipient: _pancakeData.recipient,
            amount0Max: _pancakeData.amount0Max,
            amount1Max: _pancakeData.amount1Max
        });

        (amount0, amount1) = manager.collect(params);

        logData = abi.encode(_pancakeData, amount0, amount1);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory pancakeData) {
        pancakeData = abi.decode(_callData, (Params));
    }
}
