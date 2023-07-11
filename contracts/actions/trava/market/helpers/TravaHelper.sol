// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../../interfaces/trava/market/ILendingPool.sol";
import "../../../../interfaces/trava/market/ITravaIncentivesController.sol";
import "../../../../interfaces/trava/market/IFactoryRegistry.sol";
import "./MainnetTravaAddresses.sol";

/// @title Utility functions and data used in trava actions
contract TravaHelper is MainnetTravaAddresses {
    uint16 public constant TRAVA_REFERRAL_CODE = 0;
}
