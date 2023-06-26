// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Lib_AddressManager
 * @notice Lib_AddressManager is a minimal contract that will store address of these contract on MainChain and SideChain
 */

interface ILib_AddressManager {
    /*  ╔══════════════════════════════╗
      ║        ADMIN FUNCTIONS       ║
      ╚══════════════════════════════╝ */

    /**
     * @dev set address contract by its name
     * @param _name name of contract
     * @param _address address of its
     */
    function setAddress(string memory _name, address _address) external;

    /*╔══════════════════════════════╗
      ║            GETTERS           ║
      ╚══════════════════════════════╝*/

    function getAddress(string memory _name) external view returns (address);
}
