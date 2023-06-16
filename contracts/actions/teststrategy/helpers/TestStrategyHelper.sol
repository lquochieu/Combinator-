// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../../interfaces/teststrategy/iteststrategy.sol";
import "./MainnetTestStrategyAddresses.sol";

/// @title Utility functions and data used in trava actions
contract TestStrategyHelper is MainnetTestStrategyAddresses {
  uint16 public constant TESTSTRATEGY_REFERAL_CODE = 1000;

  function increaseValForUser(uint val) public returns(uint){
    return ITestStrategy(TEST_STRATEGY_ADDRESS).increaseVal(val);
  }
  function getCurrentVal(address user) public view returns(uint){
    return ITestStrategy(TEST_STRATEGY_ADDRESS).getTestStrategy(user);
  }
}
