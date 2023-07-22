//SPDX-License-Identifier: Unlicense
/**
 * Created on 2021-10-04 11:16
 * @summary:
 * @author: phuong
 */
pragma solidity 0.8.4;

interface INFTManager {
  function discountedMint(address to, uint256 amount) external;

  function mint(address to, uint256 options) external;

  function openChest(uint256 _tokenId, uint256 _seed) external;

  function openChestBatch(uint256[] calldata _tokenIds, uint256 _seed) external;

  function tradeUp(
    uint256[] calldata _tokenIds,
    uint256 _type,
    uint256 _rarity
  ) external;

  function getTestNFTAddress() external view returns (address);

  function transmute(
    uint256 _setId,
    uint256 _rarity,
    uint256 _targetType,
    uint256 _collectedExperience
  ) external returns (uint256);
}
