// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../interfaces/teststrategy/iteststrategy.sol";

contract TestStrategy is ITestStrategy{
  mapping(address=>uint) private testStrategy;
  function increaseVal(uint val) external override returns(uint) {
    testStrategy[msg.sender] += val;
    return testStrategy[msg.sender];
}
  function getTestStrategy(address x) public view override returns(uint){
    return testStrategy[x];
  }
}