// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.4;

interface IMarketplace {
    struct Sale {
        address nftSeller;
        uint256 price;
    }

    function makeOrder(uint256 _tokenId) external;

    function cancelSale(uint256 _tokenId) external;

    function buyBack(uint256 _tokenId) external;

    function getTokenOrder(
        uint256 _tokenId
    ) external view returns (Sale memory);
}
