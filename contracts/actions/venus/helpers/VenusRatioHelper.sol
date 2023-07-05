// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../../../DS/DSMath.sol";
import "../../../interfaces/venus/IVenusOracle.sol";
import "../../../interfaces/venus/IVenusController.sol";
import "../../../interfaces/venus/IVToken.sol";
import "../../../utils/Exponential.sol";


// this is alculated the ratio of debt / adjusted collateral of compound
contract VenusRatioHelper is Exponential, DSMath {
    // solhint-disable-next-line const-name-snakecase
    IVenusController public constant venus = IVenusController(0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B);

    /// @notice Calculated the ratio of debt / adjusted collateral
    /// @param _user Address of the user
    function getSafetyRatio(address _user) public view returns (uint) {
        // For each asset the account is in
        address[] memory assets = venus.getAssetsIn(_user);
        address oracleAddr = venus.oracle();

        uint sumCollateral = 0;
        uint sumBorrow = 0;

        for (uint i = 0; i < assets.length; i++) {
            address asset = assets[i];

            (, uint cTokenBalance, uint borrowBalance, uint exchangeRateMantissa)
                                        = IVToken(asset).getAccountSnapshot(_user);

            Exp memory oraclePrice;

            if (cTokenBalance != 0 || borrowBalance != 0) {
                oraclePrice = Exp({mantissa: IVenusOracle(oracleAddr).getUnderlyingPrice(asset)});
            }

            // Sum up collateral in Usd
            if (cTokenBalance != 0) {

                (, uint collFactorMantissa) = venus.markets(address(asset));

                Exp memory collateralFactor = Exp({mantissa: collFactorMantissa});
                Exp memory exchangeRate = Exp({mantissa: exchangeRateMantissa});

                (, Exp memory tokensToUsd) = mulExp3(collateralFactor, exchangeRate, oraclePrice);

                (, sumCollateral) = mulScalarTruncateAddUInt(tokensToUsd, cTokenBalance, sumCollateral);
            }

            // Sum up debt in Usd
            if (borrowBalance != 0) {
                (, sumBorrow) = mulScalarTruncateAddUInt(oraclePrice, borrowBalance, sumBorrow);
            }
        }

        if (sumBorrow == 0) return 0;

        uint borrowPowerUsed = (sumBorrow * 10**18) / sumCollateral;
        return wdiv(1e18, borrowPowerUsed);
    }
}