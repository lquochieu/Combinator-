(require("dotenv")).config()

const { ethers } = require('ethers')
const JSBI = require("jsbi")
const { FeeAmount, computePoolAddress, Pool, Position, NonfungiblePositionManager, } = require('@uniswap/v3-sdk')
const IUniswapV3PoolABI = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
const { Token, CurrencyAmount, Percent, } = require("@uniswap/sdk-core")
const ERC20_ABI = require("@openzeppelin/contracts/build/contracts/ERC20.json").abi

// constants
const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS = "0xb086323d2C43a6f66fD20392d46ae13240108541"
const POOL_FACTORY_CONTRACT_ADDRESS = "0x5b1580e595E4267fa35D487177A79d23eB88F134"
const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 1000000000000
const MAX_FEE_PER_GAS = '100000000000'
const MAX_PRIORITY_FEE_PER_GAS = '100000000000'

const TRAVA_ADDRESS = process.env.TRAVA_BSCTESTNET
const USDC_ADDRESS = process.env.USDC_BSCTESTNET

// bsc testnet
const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545")

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const address = wallet.address

// token
const TRAVA_TOKEN = new Token(
    97,
    TRAVA_ADDRESS,
    18,
    "TRAVA",
    "TRAVA Token",
)

const USDC_TOKEN = new Token(
    97,
    USDC_ADDRESS,
    18,
    "USDC",
    "USDC Token",
)

async function getTokenTransferApproval(
    token
) {
    try {
        const tokenContract = new ethers.Contract(
            token.address,
            ERC20_ABI,
            provider
        )

        const transaction = await tokenContract.populateTransaction.approve(
            NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER
        )

        return sendTransaction({
            ...transaction,
            from: address,
        })
    } catch (e) {
        console.error(e)
        return TransactionState.Failed
    }
}

async function sendTransaction(
    transaction
) {
    if (transaction.value) {
        transaction.value = BigNumber.from(transaction.value)
    }
    const txRes = await wallet.sendTransaction(transaction)

    let receipt = null

    while (receipt === null) {
        try {
            receipt = await provider.getTransactionReceipt(txRes.hash)

            if (receipt === null) {
                continue
            }
        } catch (e) {
            console.log(`Receipt error:`, e)
            break
        }
    }

    // Transaction was successful if status === 1
    if (receipt) {
        return "Sent"
    } else {
        return "Failed"
    }
}

async function getPoolInfo() {
    const currentPoolAddress = computePoolAddress({
        factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
        tokenA: TRAVA_TOKEN,
        tokenB: USDC_TOKEN,
        fee: FeeAmount.LOW,
    })

    const poolContract = new ethers.Contract(
        currentPoolAddress,
        IUniswapV3PoolABI.abi,
        provider
    )

    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
        await Promise.all([
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.tickSpacing(),
            poolContract.liquidity(),
            poolContract.slot0(),
        ])

    return {
        token0,
        token1,
        fee,
        tickSpacing,
        liquidity,
        sqrtPriceX96: slot0[0],
        tick: slot0[1],
    }
}

async function mintPosition() {
    // Give approval to the contract to transfer tokens
    // const tokenInApproval = await getTokenTransferApproval(
    //     TRAVA_TOKEN
    // )
    // const tokenOutApproval = await getTokenTransferApproval(
    //     USDC_TOKEN
    // )

    // Fail if transfer approvals do not go through
    // if (
    //     tokenInApproval !== "Sent" ||
    //     tokenOutApproval !== "Sent"
    // ) {
    //     return "Failed"
    // }

    const positionToMint = await constructPosition(
        CurrencyAmount.fromRawAmount(
            TRAVA_TOKEN,
            fromReadableAmount(
                1000,
                TRAVA_TOKEN.decimals
            )
        ),
        CurrencyAmount.fromRawAmount(
            USDC_TOKEN,
            fromReadableAmount(
                1000,
                USDC_TOKEN.decimals
            )
        )
    )

    const mintOptions = {
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        slippageTolerance: new Percent(50, 10_000),
    }

    // get calldata for minting a position
    const { calldata, value } = NonfungiblePositionManager.addCallParameters(
        positionToMint,
        mintOptions
    )

    // build transaction
    const transaction = {
        data: calldata,
        to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
        value: value,
        from: address,
        maxFeePerGas: MAX_FEE_PER_GAS,
        maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    }

    return sendTransaction(transaction)
}

async function constructPosition(
    token0Amount,
    token1Amount
) {
    // get pool info
    const poolInfo = await getPoolInfo()

    console.log({ poolInfo })

    // construct pool instance
    const configuredPool = new Pool(
        token0Amount.currency,
        token1Amount.currency,
        poolInfo.fee,
        poolInfo.sqrtPriceX96.toString(),
        poolInfo.liquidity.toString(),
        poolInfo.tick
    )

    // create position using the maximum liquidity from input amounts
    return Position.fromAmounts({
        pool: configuredPool,
        tickLower:
            nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) -
            poolInfo.tickSpacing * 2,
        tickUpper:
            nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) +
            poolInfo.tickSpacing * 2,
        amount0: token0Amount.quotient,
        amount1: token1Amount.quotient,
        useFullPrecision: true,
    })
}

function fromReadableAmount(amount, decimals) {
    const extraDigits = Math.pow(10, countDecimals(amount))
    const adjustedAmount = amount * extraDigits
    return JSBI.divide(
        JSBI.multiply(
            JSBI.BigInt(adjustedAmount),
            JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
        ),
        JSBI.BigInt(extraDigits)
    )
}

function countDecimals(x) {
    if (Math.floor(x) === x) {
        return 0
    }
    return x.toString().split('.')[1].length || 0
}

async function main() {
    // const result = await getPoolInfo()
    // console.log(result)
    const result = await mintPosition()
    console.log(result)
}

main()

