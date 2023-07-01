/* eslint-disable import/no-extraneous-dependencies */

const hre = require('hardhat');
const fs = require('fs');
const { deployAsOwner } = require('../utils/deployer');
const { start } = require('../utils/starter');

const { changeConstantInFiles } = require('../utils/utils');

const { redeploy } = require('../../test/utils');
const { owner } = require("../sdk/rdOwner");
const { writeToEnvFile } = require('../utils/helper');

// const { topUp } = require('../utils/fork');

async function main() {
    //await topUp(OWNER_ACC);

    // get signer
    const signer = owner;

//     /*
//         ||--------------------------------------------------------------------------------||
//         ||                                 Action Contract                                || 
//         ||--------------------------------------------------------------------------------||
//         */
//     /*
//         ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
//         ||                              Utils Contract                                   ||
//         ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
//     */
//     const wrapBnb = await redeploy('WrapBnb', process.env.DFS_REGISTRY_ADDRESS);
//     writeToEnvFile("WRAP_BNB_ADDRESS", wrapBnb.address)

//     const upwrapBnb = await redeploy('UnwrapBnb', process.env.DFS_REGISTRY_ADDRESS);
//     writeToEnvFile("UNWRAP_BNB_ADDRESS", upwrapBnb.address)

//     const sendToken = await redeploy('SendToken', process.env.DFS_REGISTRY_ADDRESS);
//     writeToEnvFile("SEND_TOKEN_ADDRESS", sendToken.address)

//     const sendTokenAndUnwrap = await redeploy('SendTokenAndUnwrap', process.env.DFS_REGISTRY_ADDRESS);
//     writeToEnvFile("SEND_TOKEN_AND_UNWRAP_ADDRESS", sendTokenAndUnwrap.address)

//     const pullToken = await redeploy('PullToken', process.env.DFS_REGISTRY_ADDRESS);
//     writeToEnvFile("PULL_TOKEN_ADDRESS", pullToken.address)
//     /*
//        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
//        ||                               Trava Contract                                   ||
//        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
//    */
//     const travaBorrow = await redeploy('TravaBorrow', process.env.DFS_REGISTRY_ADDRESS);
//     writeToEnvFile("TRAVA_BORROW_ADDRESS", travaBorrow.address)

//     const travaRepay = await redeploy('TravaRepay', process.env.DFS_REGISTRY_ADDRESS);
//     writeToEnvFile("TRAVA_REPAY_ADDRESS", travaRepay.address)

//     const travaSupply = await redeploy('TravaSupply', process.env.DFS_REGISTRY_ADDRESS);
//     writeToEnvFile("TRAVA_SUPPLY_ADDRESS", travaSupply.address)

//     const travaWithdraw = await redeploy('TravaWithdraw', process.env.DFS_REGISTRY_ADDRESS);
//     writeToEnvFile("TRAVA_WITHDRAW_ADDRESS", travaWithdraw.address)

    /*
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
       ||                               PancakeV2 Contract                               ||
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   */
    //    const pancakeAddLiquidityV2 = await redeploy('PancakeAddLiquidityV2', process.env.DFS_REGISTRY_ADDRESS);
    //    writeToEnvFile("PANCAKE_ADD_LIQUIDITY_V2_ADDRESS", pancakeAddLiquidityV2.address)

    //    const pancakeSwapV2 = await redeploy('PancakeSwapV2', process.env.DFS_REGISTRY_ADDRESS);
    //    writeToEnvFile("PANCAKE_SWAP_V2_ADDRESS", pancakeSwapV2.address)

       const pancakeRemoveLiquidityV2 = await redeploy('PancakeRemoveLiquidityV2', process.env.DFS_REGISTRY_ADDRESS);
       writeToEnvFile("PANCAKE_REMOVE_LIQUIDITY_V2_ADDRESS", pancakeRemoveLiquidityV2.address)
    
    /*
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
       ||                               PancakeV3 Contract                               ||
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   */

       const pancakeAddLiquidityV3 = await redeploy('PancakeAddLiquidityV3', process.env.DFS_REGISTRY_ADDRESS);
       writeToEnvFile("PANCAKE_ADD_LIQUIDITY_V3_ADDRESS", pancakeAddLiquidityV3.address)

       const pancakeIncreaseLiquidityV3 = await redeploy('PancakeIncreaseLiquidityV3', process.env.DFS_REGISTRY_ADDRESS);
       writeToEnvFile("PANCAKE_INCREASE_LIQUIDITY_V3_ADDRESS", pancakeIncreaseLiquidityV3.address)

       const pancakeCollectV3 = await redeploy('PancakeCollectV3', process.env.DFS_REGISTRY_ADDRESS);
       writeToEnvFile("PANCAKE_COLLECT_V3_ADDRESS", pancakeCollectV3.address)

       const pancakeSwapV3 = await redeploy('PancakeSwapV3', process.env.DFS_REGISTRY_ADDRESS);
       writeToEnvFile("PANCAKE_SWAP_V3_ADDRESS", pancakeSwapV3.address)

       const pancakeRemoveLiquidityV3 = await redeploy('PancakeRemoveLiquidityV3', process.env.DFS_REGISTRY_ADDRESS);
       writeToEnvFile("PANCAKE_REMOVE_LIQUIDITY_V3_ADDRESS", pancakeRemoveLiquidityV3.address)
}

start(main);
