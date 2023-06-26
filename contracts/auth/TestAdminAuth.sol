// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../interfaces/IDFSRegistry.sol";
import "../utils/SafeERC20.sol";
import "./TestAdminVault.sol";
import "../libs/ILib_AddressManager.sol";

/// @title AdminAuth Handles owner/admin privileges over smart contracts
contract TestAdminAuth {
    using SafeERC20 for IERC20;

    TestAdminVault public adminVault;

    error SenderNotOwner();
    error SenderNotAdmin();

    modifier onlyOwner() {
        if (adminVault.owner() != msg.sender) {
            revert SenderNotOwner();
        }
        _;
    }

    modifier onlyAdmin() {
        if (adminVault.admin() != msg.sender) {
            revert SenderNotAdmin();
        }
        _;
    }

    constructor(address _libAddressManager) {
        adminVault = TestAdminVault(
            ILib_AddressManager(_libAddressManager).getAddress(
                "TEST_ADMIN_VAULT_ADDR"
            )
        );
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
}
