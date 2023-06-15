require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-interface-generator");
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
module.exports = {
  saveOnTenderly: false,
  solidity: {
    version: '0.8.4',
    compilers: [
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
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
      gasPrice: 20000000000,
      accounts: [
        "36f1ea3519a6949576c242d927dd0c74650554cdfaedbcd03fb3a80c558c03de",
      ],
    },
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      chainId: 5,
      accounts: [
        "5a84c445ecc36a8b0878e9516245633ffd630353838034cfe263a9595d49d540",
      ],
      gas: 1e7,
    },

  },
  wbnbAddress: {
    Mainnet: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    Testnet: process.env.WBNB_BSCTESTNET,
    Arbitrum: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    Optimism: '0x4200000000000000000000000000000000000006',
  },
};
