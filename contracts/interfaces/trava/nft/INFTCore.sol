//SPDX-License-Identifier: Unlicense
/**
 * Created on 2021-10-04 11:16
 * @summary:
 * @author: phuong
 */
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol";

/**
 */
interface INFTCore is IERC721EnumerableUpgradeable {
  function mint(address to) external returns (uint256);

  function mintUniqueToken(
    address to,
    uint256 specialTokenId,
    string calldata data
  ) external returns (uint256);

  function tradeUp(
    address to,
    uint256 _collectionId,
    uint256 _targetType,
    uint256 _targetRarity
  ) external returns (uint256);

  function openToken(
    uint256 _tokenId,
    uint256 _collectionId,
    uint256 _seed
  ) external;

  function addExperience(uint256 _tokenId, uint256 _collectedExperience)
    external;

  function addExperienceManager(uint256 _tokenId, uint256 _collectedExperience)
    external;

  function getMaximumAllowance() external view returns (uint256);

  //
  //External APIs
  //****************************************************** */
  //getters

  function getCounter() external view returns (uint256);

  function isTokenOpened(uint256 tokenId) external view returns (bool);

  function getType(uint256 tokenId) external view returns (uint256);

  function getRarity(uint256 tokenId) external view returns (uint256);

  function getSet(uint256 tokenId) external view returns (uint256);

  function getExperience(uint256 tokenId) external view returns (uint256);

  function batchTransferFrom(
    address from,
    address to,
    uint256[] calldata tokenIds
  ) external;

  function burn(uint256 _tokenId) external;
}
