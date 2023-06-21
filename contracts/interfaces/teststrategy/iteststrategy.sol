// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

interface ITestStrategy {
  function getTestStrategy(address x) view external returns(uint);
  function increaseVal(uint val) external returns(uint);
}