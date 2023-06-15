const hre = require('hardhat');
require("dotenv").config();
const travaV2assetsDefaultMarket = [
    // 'WETH',
    'WBNB', // 'BUSD', TODO: SOLVE BUSD LIQUIDITY PROBLEM
    // 'TRAVA',
    // 'USDC'
];

// const TRAVA_MARKET_DATA_ADDR = '0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d';

const STABLE_RATE = 1;
const VARIABLE_RATE = 2;

const getTravaFactoryRegistry = async () => {
    const factoryRegistry = await hre.ethers.getContractAt('IFactoryRegistry', process.env.FACTOR_REGISTRY_ADDRESS);
    return factoryRegistry;
}


const getTravaProviderFactory = async (factoryRegistry) => {
    const providerFactoryAddress = await factoryRegistry.getAddressesProviderFactory();
    const providerFactory = await hre.ethers.getContractAt('IAddressesProviderFactory', providerFactoryAddress);
    return providerFactory;
};

const getProviderIdByAddress = async (providerFactory, lendingPoolAddress) => {
    const providerId = await providerFactory.providerIdMap(lendingPoolAddress);
    return providerId;
}

const getLendingAddressByProviderId = async (providerFactory, providerId) => {
    const getLendingPool = await providerFactory.getLendingPool(providerId);
    return getLendingPool;
}

const getLendingPool = async (lendingPoolAddress) => {
    const lendingPool = await hre.ethers.getContractAt('ILendingPool', lendingPoolAddress);
    return lendingPool;
}

const getTravaTokenInfo = async (lendingPool, tokenAddr) => {
    const tokens = await lendingPool.getReserveData(tokenAddr);
    return tokens;
};

const getTravaReserveInfo = async (lendingPool, tokenAddr) => {
    const tokens = await lendingPool.getConfiguration(tokenAddr);
    return tokens;
};

const getTravaReserveData = async (lendingPool, tokenAddr) => {
    const tokens = await lendingPool.getReserveData(tokenAddr);
    return tokens;
};

module.exports = {
    getTravaFactoryRegistry,
    getTravaProviderFactory,
    getProviderIdByAddress,
    getLendingAddressByProviderId,
    getLendingPool,
    getTravaTokenInfo,
    getTravaReserveInfo,
    getTravaReserveData,
    travaV2assetsDefaultMarket,
    STABLE_RATE,
    VARIABLE_RATE,
};
