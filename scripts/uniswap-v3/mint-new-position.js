(require("dotenv")).config()
const { FeeAmount, TickMath } = require("@uniswap/v3-sdk")
const { ethers } = require('ethers')
const { parseUnits } = require("ethers/lib/utils")

const IUniswapV3PoolABI = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json').abi
const INonfungiblePositionManagerABI = require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json').abi


const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS = process.env.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS
const TRAVA_ADDRESS = process.env.TRAVA_BSCTESTNET
const USDC_ADDRESS = process.env.USDC_BSCTESTNET

// bsc testnet
const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545")

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const address = wallet.address

async function main() {
    let nonfungiblePositionManager = new ethers.Contract(NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, INonfungiblePositionManagerABI, provider)
    const params =
    {
        token0: USDC_ADDRESS,
        token1: TRAVA_ADDRESS,
        fee: FeeAmount.LOW,
        tickLower: -300000,
        tickUpper: 300000,
        amount0Desired: parseUnits("10", 6),
        amount1Desired: parseUnits("10", 18),
        amount0Min: 0,
        amount1Min: 0,
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 100,
    }
    // let result = await nonfungiblePositionManager.mint(params)
    console.log(JSON.stringify(params))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
