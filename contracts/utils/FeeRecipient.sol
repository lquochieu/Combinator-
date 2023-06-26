// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../auth/AdminAuth.sol";
import "../libs/ILib_AddressManager.sol";
/// @title Stores the fee recipient address and allows the owner to change it
contract FeeRecipient is AdminAuth {
    ILib_AddressManager private libAddressManager;
    address public wallet;

    constructor(address _newWallet, address _libAddressManager) AdminAuth(_libAddressManager) {
        wallet = _newWallet;
    }

    function getFeeAddr() public view returns (address) {
        return wallet;
    }

    function changeWalletAddr(address _newWallet) public onlyOwner {
        wallet = _newWallet;
    }
}