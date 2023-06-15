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
        address _lendingPool,
        address _tokenAddr,
        bool _useAsCollateral
    ) public {
        ILendingPool(_lendingPool).setUserUseReserveAsCollateral(_tokenAddr, _useAsCollateral);
    }
}
