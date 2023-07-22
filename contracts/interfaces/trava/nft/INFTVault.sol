// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface INFTVault {
    function rewardToken() external view returns (IERC20Upgradeable);

    function stakerNFT(address _staker) external returns(uint256);

    function stake(uint256 _tokenId) external;

    function redeem() external;

    function claimReward() external;

    function getTotalRewardsBalance(
        address _staker
    ) external view returns (uint256);
}
