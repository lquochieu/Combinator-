const hre = require('hardhat');

const travaV2assetsDefaultMarket = [
    'WBNB', // 'BUSD', TODO: SOLVE BUSD LIQUIDITY PROBLEM
];

const TRAVA_MARKET_DATA_ADDR = '0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d';

const STABLE_RATE = 1;
const VARIABLE_RATE = 2;

const getTravaDataProvider = async () => {
    const dataProvider = await hre.ethers.getContractAt('ITravaProtocolDataProviderV2', TRAVA_MARKET_DATA_ADDR);
    return dataProvider;
};

const getTravaTokenInfo = async (dataProvider, tokenAddr) => {
    const tokens = await dataProvider.getReserveTokensAddresses(tokenAddr);
    return tokens;
};

const getTravaReserveInfo = async (dataProvider, tokenAddr) => {
    const tokens = await dataProvider.getReserveConfigurationData(tokenAddr);
    return tokens;
};

const getTravaReserveData = async (dataProvider, tokenAddr) => {
    const tokens = await dataProvider.getReserveData(tokenAddr);
    return tokens;
};

module.exports = {
    getTravaDataProvider,
    getTravaTokenInfo,
    getTravaReserveInfo,
    getTravaReserveData,
    travaV2assetsDefaultMarket,
    STABLE_RATE,
    VARIABLE_RATE,
};
