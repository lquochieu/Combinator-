// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../DFSRegistry.sol";
import "./BotAuth.sol";
import "../../interfaces/IBotRegistry.sol";
import "../helpers/CoreHelper.sol";

contract BotRegistry is IBotRegistry, CoreHelper {
    DFSRegistry public constant registry = DFSRegistry(REGISTRY_ADDR);
    bytes4 constant BOT_AUTH_ID = bytes4(keccak256("BotAuth"));

    function botList(address x) public override view returns (bool) {
        return BotAuth(registry.getAddr(BOT_AUTH_ID)).isApproved(1, x);
    }
}