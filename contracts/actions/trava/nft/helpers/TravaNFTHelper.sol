// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./MainnetTravaAddresses.sol";
import "../../../../interfaces/trava/nft/IMarketplace.sol";
import "../../../../interfaces/trava/nft/INFTCore.sol";

/// @title Utility functions and data used in travaNFT actions
contract TravaNFTHelper is MainnetTravaNFTAddresses {
    IMarketplace marketplace = IMarketplace(NFT_MARKETPLACE);
    INFTCore travaNFT = INFTCore(NFT_CORE);
}
