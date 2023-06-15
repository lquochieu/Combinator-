// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../interfaces/trava/ILendingPool.sol";
import "../../../interfaces/trava/ITravaIncentivesController.sol";
import "../../../interfaces/trava/IFactoryRegistry.sol";

import "./MainnetTravaAddresses.sol";

/// @title Utility functions and data used in trava actions
contract TravaHelper is MainnetTravaAddresses {
    uint16 public constant TRAVA_REFERRAL_CODE = 0;

    /// @notice Enable/Disable a token as collateral for the specified Trava market
    function enableAsCollateral(
        uint256 _providerId,
        address _tokenAddr,
        bool _useAsCollateral
    ) public {
        address provider_factory = IFactoryRegistry(FACTORY_REGISTY).getAddressesProviderFactory();
        address lendingPool = IAddressesProviderFactory(provider_factory).getLendingPool(_providerId);

        ILendingPool(lendingPool).setUserUseReserveAsCollateral(_tokenAddr, _useAsCollateral);
    }

    /// @notice Returns the lending pool contract of the specified market
    function getLendingPool(uint256 _providerId) internal view returns (ILendingPool) {
        address provider_factory = IFactoryRegistry(FACTORY_REGISTY).getAddressesProviderFactory();
        return ILendingPool(IAddressesProviderFactory(provider_factory).getLendingPool(_providerId));
    }
}
