// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../interfaces/trava/ILendingPool.sol";
import "../../../interfaces/trava/ITravaIncentivesController.sol";
import "./MainnetTravaAddresses.sol";

/// @title Utility functions and data used in trava actions
contract TravaHelper is MainnetTravaAddresses {
    uint16 public constant TRAVA_REFERRAL_CODE = 64;

    /// @notice Enable/Disable a token as collateral for the specified Trava market
    function enableAsCollateral(
        uint256 _providerId,
        address _tokenAddr,
        bool _useAsCollateral
    ) public {
        address lendingPool = IAddressesProviderFactory(PROVIDER_FACTORY).getLendingPool(_providerId);

        ILendingPool(lendingPool).setUserUseReserveAsCollateral(_tokenAddr, _useAsCollateral);
    }

    /// @notice Returns the lending pool contract of the specified market
    function getLendingPool(uint256 _providerId) internal view returns (ILendingPool) {
        return ILendingPool(IAddressesProviderFactory(PROVIDER_FACTORY).getLendingPool(_providerId));
    }
}
