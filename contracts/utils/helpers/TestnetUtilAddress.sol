// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

contract TestnettUtilAddresses {
    address internal refillCaller = 0x33fDb79aFB4456B604f376A45A546e7ae700e880;
    address internal feeAddr = 0x76720aC2574631530eC8163e4085d6F98513fb27;

    address internal constant BOT_REGISTRY_ADDRESS =
        0x637726f8b08a7ABE3aE3aCaB01A80E2d8ddeF77B;
    address internal constant UNI_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address internal constant MKR_PROXY_REGISTRY =
       0xf79B1521c352294d65d9447A63B974A57F4a9D0b;

    address internal constant PROXY_FACTORY_ADDR =
        0x963A559d299a228D3653f19564913a213503383f;
    address internal constant DFS_PROXY_REGISTRY_ADDR =
        0x90329F894e796B49B39e255eE1E5EB330d320Da2;

    address internal constant WBNB_ADDR =
        0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address internal constant BNB_ADDR =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address internal constant WSTBNB_ADDR =
        0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0;
    address internal constant STBNB_ADDR =
        0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84;
    address internal constant WBTC_ADDR =
        0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
    address internal constant CHAINLINK_WBTC_ADDR =
        0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB;
    // address internal constant DAI_ADDR =
    //     0x6B175474E89094C44Da98b954EedeAC495271d0F;

    address internal constant FEE_RECEIVER_ADMIN_ADDR =
        0x595622cBd0Fc4727DF476a1172AdA30A9dDf8F43;

    // address internal constant UNI_V3_ROUTER =
    //     0xE592427A0AEce92De3Edee1F18E0157C05861564;
    // address internal constant UNI_V3_QUOTER =
    //     0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6;

    address internal constant FEE_RECIPIENT =
        0x595622cBd0Fc4727DF476a1172AdA30A9dDf8F43;

    // not needed on mainnet
    address internal constant DEFAULT_BOT =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    address public constant CHAINLINK_FEED_REGISTRY =
        0x1647a10D50e1Ebf84FF6E38e4c8dd1298E0E69cC;
}
