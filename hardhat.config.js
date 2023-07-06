/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@ethersproject/abstract-provider");
require("@ethersproject/abstract-signer");
require("@ethersproject/transactions");
require("@ethersproject/bytes");
require("@truffle/hdwallet-provider");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-waffle");
require("hardhat-interface-generator");
require("dotenv").config();
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

// let ADMIN_KEY = process.env.ADMIN + "";
// let OWNERNFT_KEY = process.env.OWNERNFT + "";
// let USER1_KEY = process.env.USER1 + "";
// let USER2_KEY = process.env.USER2 + "";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const GOERLI = "https://goerli.infura.io/v3/ba63b223746842d89619ef053b179319";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2;
const PRIVATE_KEY3 = process.env.PRIVATE_KEY3;
const BOT_KEY = process.env.BOT_KEY;

module.exports = {
  saveOnTenderly: false,
  solidity: {
    compilers: [
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 420,
          },
        },
      },
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 420,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 420,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 420,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 420,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 420,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 420,
          },
        },
      },
      {
        version: "0.5.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 420,
          },
        },
      },
      {
        version: "0.5.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 420,
          },
        },
      },
      {
        version: "0.6.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 420,
          },
        },
      },
    ],
  },
  defaultNetwork: "bscTestnet",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      // forking: {
      //   url: "https://hardcore-mayer:untrue-puppet-yearly-early-widow-spud@nd-723-346-173.p2pify.com",
      // },
      // chainId: 97,
      accounts: [
        {
          privateKey:
            "36f1ea3519a6949576c242d927dd0c74650554cdfaedbcd03fb3a80c558c03de",

          balance: "100000000000000000000000000000",
        },
        {
          privateKey:
            "37235af6356e58fd30610f5b5b3979041e029fccdfce7bf05ee868d3f7c114ec",

          balance: "100000000000000000000000000000",
        },
        {
          privateKey:
            "ddc0dbf76bd1652473690e3e67cad62a42407fa3068a0710b80481be4ef2f3bb",

          balance: "100000000000000000000000000000",
        },
      ],
      gasPrice: 5000000000,
      // gas: 25e6,
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20e9,
      gas: 2e6,
      accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`],
    },
    goerli: {
      url: GOERLI,
      chainId: 5,
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 1e7,
    },
  },
  wbnbAddress: {
    Mainnet: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    Testnet: process.env.WBNB_BSCTESTNET,
    Arbitrum: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    Optimism: "0x4200000000000000000000000000000000000006",
  },
};
