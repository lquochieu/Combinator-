// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../interfaces/IDFSRegistry.sol";
import "../../interfaces/IDSProxy.sol";
import "../../auth/AdminAuth.sol";
import "./../helpers/CoreHelper.sol";
import "../../libs/ILib_AddressManager.sol";

/// @title ProxyAuth Gets DSProxy auth from users and is callable by the Executor
contract ProxyAuth is AdminAuth {
    ILib_AddressManager private libAddressManager;
    // IDFSRegistry public constant registry = IDFSRegistry(REGISTRY_ADDR);

    /// @dev The id is on purpose not the same as contract name for easier deployment
    bytes4 constant STRATEGY_EXECUTOR_ID = bytes4(keccak256("StrategyExecutorID"));

    error SenderNotExecutorError(address, address);

    modifier onlyExecutor {
        address executorAddr = IDFSRegistry(libAddressManager.getAddress("REGISTRY_ADDR")).getAddr(STRATEGY_EXECUTOR_ID);

        if (msg.sender != executorAddr){
            revert SenderNotExecutorError(msg.sender, executorAddr);
        }

        _;
    }

    constructor(address _libAddresManager) AdminAuth(_libAddresManager) {
        libAddressManager = ILib_AddressManager(_libAddresManager);
    }

    /// @notice Calls the .execute() method of the specified users DSProxy
    /// @dev Contract gets the authority from the user to call it, only callable by Executor
    /// @param _proxyAddr Address of the users DSProxy
    /// @param _contractAddr Address of the contract which to execute
    /// @param _callData Call data of the function to be called
    function callExecute(
        address _proxyAddr,
        address _contractAddr,
        bytes memory _callData
    ) public payable onlyExecutor {
        IDSProxy(_proxyAddr).execute{value: msg.value}(_contractAddr, _callData);
    }
}