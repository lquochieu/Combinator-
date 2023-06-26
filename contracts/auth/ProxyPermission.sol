// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../DS/Guard.sol";
import "../DS/Auth.sol";

import "../libs/ILib_AddressManager.sol";

/// @title ProxyPermission Proxy contract which works with DSProxy to give execute permission
contract ProxyPermission {
    ILib_AddressManager private libAddressManager;
    bytes4 public constant EXECUTE_SELECTOR =
        bytes4(keccak256("execute(address,bytes)"));

    constructor(address _libAddressManager) {
        libAddressManager = ILib_AddressManager(_libAddressManager);
    }

    /// @notice Called in the context of DSProxy to authorize an address
    /// @param _contractAddr Address which will be authorized
    function givePermission(address _contractAddr) public {
        address currAuthority = address(DSAuth(address(this)).authority());
        DSGuard guard = DSGuard(currAuthority);

        if (currAuthority == address(0)) {
            guard = DSGuardFactory(
                libAddressManager.getAddress("FACTORY_ADDRESS")
            ).newGuard();
            DSAuth(address(this)).setAuthority(DSAuthority(address(guard)));
        }

        if (!guard.canCall(_contractAddr, address(this), EXECUTE_SELECTOR)) {
            guard.permit(_contractAddr, address(this), EXECUTE_SELECTOR);
        }
    }

    /// @notice Called in the context of DSProxy to remove authority of an address
    /// @param _contractAddr Auth address which will be removed from authority list
    function removePermission(address _contractAddr) public {
        address currAuthority = address(DSAuth(address(this)).authority());

        // if there is no authority, that means that contract doesn't have permission
        if (currAuthority == address(0)) {
            return;
        }

        DSGuard guard = DSGuard(currAuthority);
        guard.forbid(_contractAddr, address(this), EXECUTE_SELECTOR);
    }
}
