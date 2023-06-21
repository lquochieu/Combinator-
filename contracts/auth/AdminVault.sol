// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
import "./helpers/AuthHelper.sol";

/// @title A stateful contract that holds and can change owner/admin
contract AdminVault {
    address public owner;
    address public admin;

    address internal constant ADMIN_ADDR = 0x7c1D8EC0D2aF6e6083d80D28fF9dFe903Fb7d955;

    error SenderNotAdmin();

    constructor() {
        owner = msg.sender;
        admin = ADMIN_ADDR;
    }

    /// @notice Admin is able to change owner
    /// @param _owner Address of new owner
    function changeOwner(address _owner) public {
        if (admin != msg.sender){
            revert SenderNotAdmin();
        }
        owner = _owner;
    }

    /// @notice Admin is able to set new admin
    /// @param _admin Address of multisig that becomes new admin
    function changeAdmin(address _admin) public {
        if (admin != msg.sender){
            revert SenderNotAdmin();
        }
        admin = _admin;
    }

}