// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../interfaces/IWETH.sol";
import "../../utils/TokenUtils.sol";
import "../ActionBase.sol";
import "./helpers/TravaHelper.sol";

/// @title Withdraw a token from an Trava market based on providerId
contract TravaWithdraw is ActionBase, TravaHelper {
    using TokenUtils for address;

    struct Params {
        uint256 providerId;
        address tokenAddr;
        uint256 amount;
        address to;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.providerId = _parseParamUint(
            params.providerId,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        params.tokenAddr = _parseParamAddr(
            params.tokenAddr,
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
        params.to = _parseParamAddr(
            params.to,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        (uint256 withdrawnAmount, bytes memory logData) = _withdraw(
            params.providerId,
            params.tokenAddr,
            params.amount,
            params.to
        );
        emit ActionEvent("TravaWithdraw", logData);
        return bytes32(withdrawnAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _withdraw(
            params.providerId,
            params.tokenAddr,
            params.amount,
            params.to
        );
        logger.logActionDirectEvent("TravaWithdraw", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice User withdraws tokens from the Trava protocol
    /// @param _providerId id of provider for specific providerId
    /// @param _tokenAddr The address of the token to be withdrawn
    /// @param _amount Amount of tokens to be withdrawn -> send type(uint).max for whole amount
    /// @param _to Where the withdrawn tokens will be sent
    function _withdraw(
        uint256 _providerId,
        address _tokenAddr,
        uint256 _amount,
        address _to
    ) internal returns (uint256, bytes memory) {
        ILendingPool lendingPool = getLendingPool(_providerId);
        uint256 tokenBefore;

        // only need to remember this is _amount is max, no need to waste gas otherwise
        if (_amount == type(uint256).max) {
            tokenBefore = _tokenAddr.getBalance(_to);
        }

        // withdraw underlying tokens from Trava and send _to address
        lendingPool.withdraw(_tokenAddr, _amount, _to);

        // if the input amount is max calc. what was the exact _amount
        if (_amount == type(uint256).max) {
            _amount = _tokenAddr.getBalance(_to) - tokenBefore;
        }

        bytes memory logData = abi.encode(
            _providerId,
            _tokenAddr,
            _amount,
            _to
        );
        return (_amount, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
