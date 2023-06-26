// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Lib_AddressManager
 * @notice Lib_AddressManager is a minimal contract that will store address of these contract on MainChain and SideChain
 */

contract Lib_AddressManager is
    Ownable,
    Pausable,
    ReentrancyGuard
{
    address internal deployer;

    mapping(bytes32 => address) internal addresses;
    mapping(uint256 => address) internal gates;
    mapping(uint256 => address) internal transactors;

    /*  ╔══════════════════════════════╗
      ║        ADMIN FUNCTIONS       ║
      ╚══════════════════════════════╝ */

    /**
     * @dev set address contract by its name
     * @param _name name of contract
     * @param _address address of its
     */
    function setAddress(string memory _name, address _address)
        external
        onlyOwner
    {
        bytes32 nameHash = _getNameHash(_name);
        addresses[nameHash] = _address;
    }

    /*╔══════════════════════════════╗
      ║            GETTERS           ║
      ╚══════════════════════════════╝*/

    function getAddress(string memory _name) external view returns (address) {
        return addresses[_getNameHash(_name)];
    }

    function _getNameHash(string memory _name) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name));
    }
}