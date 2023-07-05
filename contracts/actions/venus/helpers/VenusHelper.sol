// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../interfaces/venus/IVenusController.sol";
import "../../../interfaces/venus/IVToken.sol";
import "../../../utils/TokenUtils.sol";
import "./MainnetVenusAddresses.sol";

/// @title Utility functions and data used in Compound actions
contract VenusHelper is MainnetVenusAddresses{

    uint256 constant NO_ERROR = 0;
    error VenusEnterMarketError();
    error VenusExitMarketError();

    // @notice Returns the underlying token address of the given cToken
    function getUnderlyingAddr(address _cTokenAddr) internal returns (address tokenAddr) {
        // cEth has no .underlying() method
        if (_cTokenAddr == V_BNB_ADDR) return TokenUtils.WBNB_ADDR;

        tokenAddr = IVToken(_cTokenAddr).underlying();
    }

    /// @notice Enters the Venusound market so it can be deposited/borrowed
    /// @dev Markets can be entered multiple times, without the code reverting
    /// @param _cTokenAddr CToken address of the token
    function enterMarket(address _cTokenAddr) public {
        address[] memory markets = new address[](1);
        markets[0] = _cTokenAddr;

        uint256[] memory errCodes = IVenusController(COMPTROLLER_ADDR).enterMarkets(markets);

        if (errCodes[0] != NO_ERROR){
            revert VenusEnterMarketError();
        }
    }

    /// @notice Exits the Venusound market
    /// @param _cTokenAddr CToken address of the token
    function exitMarket(address _cTokenAddr) public {
        if (IVenusController(COMPTROLLER_ADDR).exitMarket(_cTokenAddr) != NO_ERROR){
            revert VenusExitMarketError();
        }
    }
}
