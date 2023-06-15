/* eslint-disable import/no-extraneous-dependencies */
require('dotenv-safe').config();
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
const tdly = require('@tenderly/hardhat-tenderly');
require('@nomiclabs/hardhat-ethers');
// require("hardhat-gas-reporter");
require('hardhat-log-remover');

const Dec = require('decimal.js');
const dfs = require('@defisaver/sdk');

tdly.setup({ automaticVerifications: false });

dfs.configure({
  testingMode: true,
});

Dec.set({
  precision: 50,
  rounding: 4,
  toExpNeg: -7,
  toExpPos: 21,
  maxE: 9e15,
  minE: -9e15,
  modulo: 1,
  crypto: false,
});

const MAX_NODE_COUNT = 22;
const testNetworks = Object.fromEntries([...Array(MAX_NODE_COUNT).keys()].map((c, i) => [
  `local${i}`, { url: `http://127.0.0.1:${8545 + i}`, timeout: 10000000, name: 'mainnet' },
]));
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  saveOnTenderly: false,
  defaultNetwork: "bscTestnet",
  lightTesting: true,
  networks: {
    ...testNetworks,
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    rinkeby: {
      url: INFURA_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    kovan: {
      url: KOVAN_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    goerli: {
      url: GOERLI,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 100000,
  },
  bnbAddress: {
    Testnet: process.env.WBNB_BSCTESTNET,
  },
};

require('./scripts/hardhat-tasks.js');
