// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../libs/ILib_AddressManager.sol";
/// @title A stateful contract that holds and can change owner/admin
contract TestAdminVault {
    address public owner;
    address public admin;

    error SenderNotAdmin();

    constructor(address _libAddressManager) {
        owner = msg.sender;
        admin = ILib_AddressManager(_libAddressManager).getAddress("ADMIN_ADDR");
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