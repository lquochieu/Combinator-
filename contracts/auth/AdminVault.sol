// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
import "./helpers/AuthHelper.sol";
import "../libs/ILib_AddressManager.sol";

/// @title A stateful contract that holds and can change owner/admin
contract AdminVault {
    ILib_AddressManager private libAddressManager;

    address public owner;
    // address public admin;

    error SenderNotAdmin();

    constructor(address _libAddressManager) {
        owner = msg.sender;
        libAddressManager = ILib_AddressManager(_libAddressManager);
    }

    /// @notice Admin is able to change owner
    /// @param _owner Address of new owner
    function changeOwner(address _owner) public {
        if (libAddressManager.getAddress("ADMIN_ADDR") != msg.sender) {
            revert SenderNotAdmin();
        }
        owner = _owner;
    }

    /// @notice Admin is able to set new admin
    /// @param _admin Address of multisig that becomes new admin
    function changeAdmin(address _admin) public {
        if (libAddressManager.getAddress("ADMIN_ADDR") != msg.sender) {
            revert SenderNotAdmin();
        }
        libAddressManager.setAddress("ADMIN_ADDR", _admin);
    }

    // function getLibAddressManager() public view returns (address) {
    //     return address(libAddressManager);
    // }

    function admin() public view returns (address) {
        return libAddressManager.getAddress("ADMIN_ADDR");
    }

}
