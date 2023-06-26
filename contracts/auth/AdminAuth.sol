// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../interfaces/IDFSRegistry.sol";
import "../utils/SafeERC20.sol";
import "./AdminVault.sol";
import "../libs/ILib_AddressManager.sol";

/// @title AdminAuth Handles owner/admin privileges over smart contracts
contract AdminAuth {
    using SafeERC20 for IERC20;

    ILib_AddressManager private libAddressManager;

    error SenderNotOwner();
    error SenderNotAdmin();

    modifier onlyOwner() {
        if (AdminVault(libAddressManager.getAddress("ADMIN_VAULT_ADDR")).owner() != msg.sender) {
            revert SenderNotOwner();
        }
        _;
    }

    modifier onlyAdmin() {
        if (AdminVault(libAddressManager.getAddress("ADMIN_VAULT_ADDR")).admin() != msg.sender) {
            revert SenderNotAdmin();
        }
        _;
    }

    constructor(address _libAddressManager) {
        libAddressManager = ILib_AddressManager(_libAddressManager);
    }

    /// @notice withdraw stuck funds
    function withdrawStuckFunds(
        address _token,
        address _receiver,
        uint256 _amount
    ) public onlyOwner {
        if (_token == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            payable(_receiver).transfer(_amount);
        } else {
            IERC20(_token).safeTransfer(_receiver, _amount);
        }
    }

    /// @notice Destroy the contract
    function kill() public onlyAdmin {
        selfdestruct(payable(msg.sender));
    }

    function adminVault() public view returns(AdminVault) {
        return AdminVault(libAddressManager.getAddress("ADMIN_VAULT_ADDR"));
    }
    // function getLibAddressManager() public view returns (address) {
    //     return address(libAddressManager);
    // }
}
