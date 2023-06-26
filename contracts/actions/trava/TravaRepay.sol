// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../interfaces/IWBNB.sol";
import "../../utils/TokenUtils.sol";
import "../ActionBase.sol";
import "./helpers/TravaHelper.sol";

/// @title Payback a token a user borrowed from an Trava based on market
contract TravaRepay is ActionBase, TravaHelper {
    using TokenUtils for address;
    struct Params {
        address market;
        address tokenAddr;
        uint256 amount;
        address from;
        address onBehalf;
    }

    constructor(address _libAddressManager) ActionBase(_libAddressManager) {}

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.market = _parseParamAddr(params.market, _paramMapping[0], _subData, _returnValues);
        params.tokenAddr = _parseParamAddr(params.tokenAddr, _paramMapping[1], _subData, _returnValues);
        params.amount = _parseParamUint(params.amount, _paramMapping[2], _subData, _returnValues);
        params.from = _parseParamAddr(params.from, _paramMapping[4], _subData, _returnValues);
        params.onBehalf = _parseParamAddr(params.onBehalf, _paramMapping[5], _subData, _returnValues);

        (uint256 paybackAmount, bytes memory logData) = _payback(
            params.market,
            params.tokenAddr,
            params.amount,
            params.from,
            params.onBehalf
        );
        emit ActionEvent("TravaRepay", logData);
        return bytes32(paybackAmount);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(bytes memory _callData) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _payback(
            params.market,
            params.tokenAddr,
            params.amount,
            params.from,
            params.onBehalf
        );
        logger().logActionDirectEvent("TravaRepay", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    /// @notice User paybacks tokens to the Trava protocol
    /// @dev User needs to approve the DSProxy to pull the _tokenAddr tokens
    /// @param _market  provider id for specific market
    /// @param _tokenAddr The address of the token to be paid back
    /// @param _amount Amount of tokens to be paid back
    /// @param _from Where are we pulling the payback tokens amount from
    /// @param _onBehalf For what user we are paying back the debt, defaults to proxy
    function _payback(
        address _market,
        address _tokenAddr,
        uint256 _amount,
        address _from,
        address _onBehalf
    ) internal returns (uint256, bytes memory) {
        // default to onBehalf of proxy
        if (_onBehalf == address(0)) {
            _onBehalf = address(this);
        }
        ILendingPool lendingPool = ILendingPool(_market);
        uint256 maxDebt = getWholeDebt(_market, _tokenAddr, _onBehalf);
        _amount = _amount > maxDebt ? maxDebt : _amount;

        _tokenAddr.pullTokensIfNeeded(_from, _amount);
        _tokenAddr.approveToken(address(lendingPool), _amount);

        uint256 tokensBefore = _tokenAddr.getBalance(address(this));

        lendingPool.repay(_tokenAddr, _amount, _onBehalf);

        uint256 tokensAfter = _tokenAddr.getBalance(address(this));

        // send back any leftover tokens that weren't used in the repay
        _tokenAddr.withdrawTokens(_from, tokensAfter);

        bytes memory logData = abi.encode(
            _market,
            _tokenAddr,
            _amount,
            _from,
            _onBehalf
        );
        return (tokensBefore - tokensAfter, logData);
    }

    function parseInputs(bytes memory _callData) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }

    function getWholeDebt(address _market, address _tokenAddr, address _debtOwner) internal view returns (uint256) {
        ILendingPool lendingPool = ILendingPool(_market);
        address variableDebtTokenAddress = lendingPool.getReserveData(_tokenAddr).variableDebtTokenAddress;
        
        return variableDebtTokenAddress.getBalance(_debtOwner);
        
    }
}
