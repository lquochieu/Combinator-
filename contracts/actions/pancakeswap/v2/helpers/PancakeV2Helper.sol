// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "./MainnetPancakeV2Addresses.sol";

import "../../../../interfaces/pancakeswap/v2/IPancakeRouter02.sol";

contract PancakeV2Helper is MainnetPancakeV2Addresses {

    IPancakeRouter02 public constant pancakeRouter =
        IPancakeRouter02(PANCAKE_ROUTER);
}