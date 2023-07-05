// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

abstract contract IVenusController {
    struct VenusMarketState {
        uint224 index;
        uint32 block;
    }

    mapping(address => uint) public venusSpeeds;

    mapping(address => uint) public borrowCaps;

    mapping(address => uint) public venusBorrowSpeeds;
    mapping(address => uint) public venusSupplySpeeds;

    function claimVenus(address holder) public virtual;
    function claimVenus(address holder, address[] memory cTokens) public virtual;
    function claimVenus(address[] memory holders, address[] memory cTokens, bool borrowers, bool suppliers) public virtual;

    function venusSupplyState(address) public view virtual returns (VenusMarketState memory);
    function venusSupplierIndex(address,address) public view virtual returns (uint);
    function venusAccrued(address) public view virtual returns (uint);

    function venusBorrowState(address) public view virtual returns (VenusMarketState memory);
    function venusBorrowerIndex(address,address) public view virtual returns (uint);

    function enterMarkets(address[] calldata cTokens) external virtual returns (uint256[] memory);

    function exitMarket(address cToken) external virtual returns (uint256);

    function getAssetsIn(address account) external virtual view returns (address[] memory);

    function markets(address account) public virtual view returns (bool, uint256);

    function getAccountLiquidity(address account) external virtual view returns (uint256, uint256, uint256);

    function oracle() public virtual view returns (address);
}
