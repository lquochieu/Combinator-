// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "../../../../../interfaces/trava/nft/INFTVault.sol";
import "../../helpers/TravaNFTHelper.sol";
import "./MainnetTravaNFTVaultAddresses.sol";

/// @title Utility functions and data used in travaNFT actions
contract TravaNFTVaultHelper is TravaNFTHelper, MainnetTravaNFTVaultAddresses {
    function _sendbackRewardTokens(
        address _vault,
        address _from
    ) internal returns (uint256) {
        IERC20Upgradeable rewardsToken = INFTVault(_vault).rewardToken();

        uint256 totalRewards = rewardsToken.balanceOf(_from);
        rewardsToken.transferFrom(address(this), _from, totalRewards);
        return totalRewards;
    }

    
}
