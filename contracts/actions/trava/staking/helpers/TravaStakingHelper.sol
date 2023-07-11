// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../../interfaces/trava/staking/IStakedToken.sol";
import "../../../../interfaces/trava/staking/IStakedTrava.sol";
import "../../../../interfaces/IBEP20.sol";

import "./MainnetTravaStakingAddresses.sol";

/// @title Utility functions and data used in trava actions
contract TravaStakingHelper is MainnetTravaStakingAddresses {
    IStakedTrava stakedToken = IStakedTrava(STAKED_TRAVA_TOKEN_ADDRESS);
}
