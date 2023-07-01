// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "./MainnetPancakeV3Addresses.sol";

import "../../../../interfaces/pancakeswap/v3/ISmartRouter.sol";
import "../../../../interfaces/pancakeswap/v3-periphery/INonfungiblePositionManager.sol";

contract PancakeV3Helper is MainnetPancakeV3Addresses {
    
    ISmartRouter public constant smartRouter =
        ISmartRouter(SMART_ROUTER);
    INonfungiblePositionManager public constant manager = INonfungiblePositionManager(NON_FUNGIBLE_POSITION_MANAGER);
}