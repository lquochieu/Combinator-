//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

interface INFTAuctionWithProposal {
  function cancelAuction(uint256 _tokenId) external;

  function createAuction(
    uint256 _tokenId,
    uint256 _startingBid,
    uint256 _duration,
    uint256 _ceilingPrice,
    uint256 _method
  ) external;

  function editAuctionPrice(uint256 _tokenId, uint256 _newPrice) external;

  function finalizeAuction(uint256 _tokenId) external;

  function getRemainingTime(uint256 _tokenId) external view returns (uint256);

  function getTokenOfOwnerAtIndex(address _owner, uint256 _index)
    external
    view
    returns (uint256);

  function getTokenOfOwnerBalance(address _owner)
    external
    view
    returns (uint256);

  function getTokenOnAunctionAtIndex(uint256 _index)
    external
    view
    returns (uint256);

  function getTokenOnAunctionCount() external view returns (uint256);

  function initialize(
    address _travaNFTddress,
    address _paymentToken,
    address _recipient,
    uint256 _percent,
    uint256 _minimumBidPercent,
    uint256 _minimumRemainingTime,
    uint256 _minimumEndTime,
    uint256 _maximumEndTime
  ) external;

  function isAuctionOngoing(uint256 _tokenId) external view returns (bool);

  function makeBid(uint256 _tokenId, uint256 _bidPrice) external;

  function owner() external view returns (address);

  function pauseContract() external;

  function paused() external view returns (bool);

  function renounceOwnership() external;

  function setMaximumEndTime(uint256 _maximumEndTime) external;

  function setMinimumBidStepPercent(uint256 _minimumBidStepPercent) external;

  function setMinimumEndTime(uint256 _minimumEndTime) external;

  function setMinimumPrice(uint256 _minimumPrice) external;

  function setMinimumRemainingTime(uint256 _minimumRemainingTime) external;

  function setReceiver(address _receiver) external;

  function transferOwnership(address newOwner) external;

  function unpauseContract() external;
}
