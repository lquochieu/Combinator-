// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../DFSRegistry.sol";
import "./BotAuth.sol";
import "../../interfaces/IBotRegistry.sol";
import "../../libs/ILib_AddressManager.sol";

contract BotRegistry is IBotRegistry {
    ILib_AddressManager private libAddressManager;

    constructor(address _libAddresManager) {
        libAddressManager = ILib_AddressManager(_libAddresManager);
    }
    
    bytes4 constant BOT_AUTH_ID = bytes4(keccak256("BotAuth"));

    function botList(address x) public override view returns (bool) {
        return BotAuth(DFSRegistry(libAddressManager.getAddress("REGISTRY_ADDR")).getAddr(BOT_AUTH_ID)).isApproved(1, x);
    }
}