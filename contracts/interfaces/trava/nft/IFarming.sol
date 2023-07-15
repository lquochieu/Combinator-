// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.4;

interface IFarming {
    function stake(uint256[] calldata _ids, uint128 _level) external;

    function redeemAndClaim(uint256[] calldata _ids, uint128 _level) external;

    function claimReward(uint256[] calldata _ids, uint128 _level) external;
    
    function polishNFT(uint256[] calldata _ids, uint128 _level) external;

    function getTotalRewardsBalance(uint256[] calldata _ids) external view returns(uint256);
}
