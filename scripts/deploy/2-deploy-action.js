/* eslint-disable import/no-extraneous-dependencies */

const hre = require("hardhat");
const fs = require("fs");
const { deployAsOwner } = require("../utils/deployer");
const { start } = require("../utils/starter");

const { changeConstantInFiles } = require("../utils/utils");

const { redeploy } = require("../../test/utils");
const { owner } = require("../sdk/rdOwner");
const { writeToEnvFile } = require("../utils/helper");

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

  //   const sendTokens = await redeploy('SendTokens', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("SEND_TOKENS_ADDRESS", sendTokens.address)

  //     const sendTokenAndUnwrap = await redeploy('SendTokenAndUnwrap', process.env.DFS_REGISTRY_ADDRESS);
  //     writeToEnvFile("SEND_TOKEN_AND_UNWRAP_ADDRESS", sendTokenAndUnwrap.address)

  //     const pullToken = await redeploy('PullToken', process.env.DFS_REGISTRY_ADDRESS);
  //     writeToEnvFile("PULL_TOKEN_ADDRESS", pullToken.address)
  //     /*
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava Market Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */
  // const travaBorrow = await redeploy(
  //   "TravaBorrow",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_BORROW_ADDRESS", travaBorrow.address);

  // const travaRepay = await redeploy(
  //   "TravaRepay",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_REPAY_ADDRESS", travaRepay.address);

  //     const travaSupply = await redeploy('TravaSupply', process.env.DFS_REGISTRY_ADDRESS);
  //     writeToEnvFile("TRAVA_SUPPLY_ADDRESS", travaSupply.address)

  //     const travaWithdraw = await redeploy('TravaWithdraw', process.env.DFS_REGISTRY_ADDRESS);
  //     writeToEnvFile("TRAVA_WITHDRAW_ADDRESS", travaWithdraw.address)
  // const travaClaimRewards = await redeploy('TravaClaimRewards', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("TRAVA_CLAIMS_REWARDS_ADDRESS", travaClaimRewards.address)
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava Governance Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */
  // const travaGovernanceCreateLock = await redeploy(
  //   "TravaGovernanceCreateLock",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_GOVERNANCE_CREATE_LOCK_ADDRESS", travaGovernanceCreateLock.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava Staking Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */
  // const travaStakingStake = await redeploy(
  //   "TravaStakingStake",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_STAKING_STAKE_ADDRESS", travaStakingStake.address);

  // const travaStakingClaimRewards = await redeploy(
  //   "TravaStakingClaimRewards",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_STAKING_CLAIM_REWARDS_ADDRESS", travaStakingClaimRewards.address);

  // const travaStakingRedeem = await redeploy(
  //   "TravaStakingRedeem",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_STAKING_REDEEM_ADDRESS", travaStakingRedeem.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */
  const travaNFTTransfer = await redeploy(
    "TravaNFTTransfer",
    process.env.DFS_REGISTRY_ADDRESS
  );
  writeToEnvFile("TRAVA_NFT_TRANSFER_ADDRESS", travaNFTTransfer.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT  Marketplace Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // const travaNFTBuy = await redeploy(
  //   "TravaNFTBuy",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_BUY_ADDRESS", travaNFTBuy.address);

  // const travaNFTCreateSale = await redeploy(
  //   "TravaNFTCreateSale",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_CREATE_SALE_ADDRESS", travaNFTCreateSale.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT  Manager Contrac                       ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // const travaNFTManagerMint = await redeploy(
  //   "TravaNFTManagerMint",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_MANAGER_MINT_ADDRESS", travaNFTManagerMint.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT farm Contract                          ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // const travaNFTVaultClaimReward = await redeploy(
  //   "TravaNFTVaultClaimReward",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_VAULT_CLAIM_REWARD_ADDRESS", travaNFTVaultClaimReward.address);

  // const travaNFTVaultRedeem = await redeploy(
  //   "TravaNFTVaultRedeem",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_VAULT_REDEEM_ADDRESS", travaNFTVaultRedeem.address);

  // const travaNFTVaultStake = await redeploy(
  //   "TravaNFTVaultStake",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_VAULT_STAKE_ADDRESS", travaNFTVaultStake.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT Auction Contract                          ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */

  // const travaNFTAuctionCreateAuction = await redeploy(
  //   "TravaNFTAuctionCreateAuction",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_AUCTION_CREATE_AUCTION_ADDRESS", travaNFTAuctionCreateAuction.address);

  // const travaNFTAuctionMakeBid = await redeploy(
  //   "TravaNFTAuctionMakeBid",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("TRAVA_NFT_AUCTION_MAKE_BID_ADDRESS", travaNFTAuctionMakeBid.address);

  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //        ||                               Trava NFT  Expedition Contract                                   ||
  //        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
  //    */
  /*
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
       ||                               PancakeV2 Contract                               ||
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   */
  // const pancakeAddLiquidityV2 = await redeploy(
  //   "PancakeAddLiquidityV2",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile(
  //   "PANCAKE_ADD_LIQUIDITY_V2_ADDRESS",
  //   pancakeAddLiquidityV2.address
  // );

  // const pancakeSwapV2 = await redeploy(
  //   "PancakeSwapV2",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("PANCAKE_SWAP_V2_ADDRESS", pancakeSwapV2.address);

  // const pancakeRemoveLiquidityV2 = await redeploy(
  //   "PancakeRemoveLiquidityV2",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile(
  //   "PANCAKE_REMOVE_LIQUIDITY_V2_ADDRESS",
  //   pancakeRemoveLiquidityV2.address
  // );

  /*
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
       ||                               PancakeV3 Contract                               ||
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   */

  // const pancakeCreatePoolV3 = await redeploy('PancakeCreatePoolV3', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("PANCAKE_CREATE_POOL_V3_ADDRESS", pancakeCreatePoolV3.address)

  // const pancakeAddLiquidityV3 = await redeploy('PancakeAddLiquidityV3', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("PANCAKE_ADD_LIQUIDITY_V3_ADDRESS", pancakeAddLiquidityV3.address)

  // const pancakeIncreaseLiquidityV3 = await redeploy('PancakeIncreaseLiquidityV3', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("PANCAKE_INCREASE_LIQUIDITY_V3_ADDRESS", pancakeIncreaseLiquidityV3.address)

  // const pancakeSwapV3 = await redeploy('PancakeSwapV3', process.env.DFS_REGISTRY_ADDRESS);
  // writeToEnvFile("PANCAKE_SWAP_V3_ADDRESS", pancakeSwapV3.address)

  //  const pancakeCollectV3 = await redeploy('PancakeCollectV3', process.env.DFS_REGISTRY_ADDRESS);
  //  writeToEnvFile("PANCAKE_COLLECT_V3_ADDRESS", pancakeCollectV3.address)

  //  const pancakeRemoveLiquidityV3 = await redeploy('PancakeRemoveLiquidityV3', process.env.DFS_REGISTRY_ADDRESS);
  //  writeToEnvFile("PANCAKE_REMOVE_LIQUIDITY_V3_ADDRESS", pancakeRemoveLiquidityV3.address)

  /*
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
       ||                               Venus     Contract                               ||
       ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
   */
  // const venusBorrow = await redeploy(
  //   "VenusBorrow",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("VENUS_BORROW_ADDRESS", venusBorrow.address);

  // const venusRepay = await redeploy(
  //   "VenusPayback",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("VENUS_PAYBACK_ADDRESS", venusRepay.address);

  // const venusSupply = await redeploy(
  //   "VenusSupply",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("VENUS_SUPPLY_ADDRESS", venusSupply.address);

  // const venusWithdraw = await redeploy(
  //   "VenusWithdraw",
  //   process.env.DFS_REGISTRY_ADDRESS
  // );
  // writeToEnvFile("VENUS_WITHDRAW_ADDRESS", venusWithdraw.address);
}

start(main);
