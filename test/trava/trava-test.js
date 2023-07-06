const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { supplyTrava, executeAction } = require("../actions");
const { getProxy } = require("../utils");
const { ethers } = require("ethers");
const { keccak256 } = require("web3-utils");

describe("Trava-Supply", function () {
  this.timeout(150000);

  it("Test trava supply", async () => {
    let triggerCallData = [];
    let actionsCallData = [];
    let subData = [];
    let actionIds = [];

    const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330";
    const amount = hre.ethers.utils.parseEther("10");
    const amountSupply = hre.ethers.utils.parseEther("1");
    const amountBorrow = 1e6;
    const amountRepay = 1e14;
    const amountWithdraw = hre.ethers.utils.parseEther("1");
    const from = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;
    const enableAsColl = false;
    const trava = "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435";

    // const IERC20 = await hre.ethers.getContractAt("IERC20Test", trava);
    // await IERC20.approve(proxy.address, amount);

    const traveSupply = new Action(
      "TravaSupply",
      process.env.TRAVA_SUPPLY,
      ["address", "address", "uint256", "address", "address", "bool"],
      [market, trava, amountSupply, from, onBehalf, enableAsColl]
    );

    const traveBorrow = new Action(
      "TravaBorrow",
      process.env.TRAVA_BORROW_ADDRESS,
      ["address", "address", "uint256", "address", "address"],
      [market, trava, amountBorrow, from, onBehalf]
    );

    const traveRepay = new Action(
      "TravaRepay",
      process.env.TRAVA_REPAY_ADDRESS,
      ["address", "address", "uint256", "address", "address"],
      [market, trava, amountRepay, from, onBehalf]
    );

    const traveWithdrawAction = new Action(
      "TravaWithdraw",
      process.env.TRAVA_WITHDRAW_ADDRESS,
      ["address", "address", "uint256", "address"],
      [market, trava, amountWithdraw, from]
    );

    // const calldata = traveSupply.encodeForRecipe()[0];
    const callDataSupply = traveSupply.encodeForDsProxyCall()[1];
    const calldataBorrow = traveBorrow.encodeForDsProxyCall()[1];
    const calldatRepay = traveRepay.encodeForDsProxyCall()[1];
    const calldataWithdraw = traveWithdrawAction.encodeForDsProxyCall()[1];

    actionsCallData.push(callDataSupply);
    actionsCallData.push(calldataBorrow);
    actionsCallData.push(calldatRepay);
    actionsCallData.push(calldataWithdraw);

    let paramMapping = [
      // 6 elements in array
      [128, 129, 130, 131, 132, 133],
      // 5 elements in array
      [134, 135, 136, 137, 138],
      // 5 elements in array
      [139, 140, 141, 142, 143],
      // 4 elements in array
      [144, 145, 146, 147],
    ];

    // subdata for supply
    const subDataMarketSupply = abiCoder.encode(["address"], [market]);
    const subDataTokenSupply = abiCoder.encode(["address"], [trava]);
    const subDataAmountSupply = abiCoder.encode(["uint256"], [amountSupply]);
    const subDataFromSupply = abiCoder.encode(["address"], [from]);
    const subDataOnBehalfSupply = abiCoder.encode(["address"], [onBehalf]);
    const subDataEnableAsCollSupply = abiCoder.encode(["bool"], [enableAsColl]);

    // subdata for borrow
    const subDataMarketBorrow = abiCoder.encode(["address"], [market]);
    const subDataTokenBorrow = abiCoder.encode(["address"], [trava]);
    const subDataAmountBorrow = abiCoder.encode(["uint256"], [amountBorrow]);
    const subDataFromBorrow = abiCoder.encode(["address"], [from]);
    const subDataOnBehalfBorrow = abiCoder.encode(["address"], [onBehalf]);

    // subdata for repay
    const subDataMarketRepay = abiCoder.encode(["address"], [market]);
    const subDataTokenRepay = abiCoder.encode(["address"], [trava]);
    const subDataAmountRepay = abiCoder.encode(["uint256"], [amountRepay]);
    const subDataFromRepay = abiCoder.encode(["address"], [from]);

    // subdata for withdraw
    const subDataMarketWithdraw = abiCoder.encode(["address"], [market]);
    const subDataTokenWithdraw = abiCoder.encode(["address"], [trava]);
    const subDataAmountWithdraw = abiCoder.encode(
      ["uint256"],
      [amountWithdraw]
    );
    const subDataFromWithdraw = abiCoder.encode(["address"], [from]);

    subData = [
      subDataMarketSupply,
      subDataTokenSupply,
      subDataAmountSupply,
      subDataFromSupply,
      subDataOnBehalfSupply,
      subDataEnableAsCollSupply,
      subDataMarketBorrow,
      subDataTokenBorrow,
      subDataAmountBorrow,
      subDataFromBorrow,
      subDataOnBehalfBorrow,
      subDataMarketRepay,
      subDataTokenRepay,
      subDataAmountRepay,
      subDataFromRepay,
      subDataMarketWithdraw,
      subDataTokenWithdraw,
      subDataAmountWithdraw,
      subDataFromWithdraw,
    ];

    actionIds = [
      // keccak256("TravaSupply").substr(0, 10)
      keccak256("TravaSupply").substr(0, 10),
      // keccak256("TravaBorrow").substr(0, 10)
      keccak256("TravaBorrow").substr(0, 10),
      // keccak256("TravaRepay").substr(0, 10)
      keccak256("TravaRepay").substr(0, 10),
      // keccak256("TravaWithdraw").substr(0, 10)
      keccak256("TravaWithdraw").substr(0, 10),
    ];

    const supplyContract = await hre.ethers.getContractAt(
      "TravaSupply",
      process.env.TRAVA_SUPPLY_ADDRESS
    );

    const borrowContract = await hre.ethers.getContractAt(
      "TravaBorrow",
      process.env.TRAVA_BORROW_ADDRESS
    );

    const repayContract = await hre.ethers.getContractAt(
      "TravaRepay",
      process.env.TRAVA_REPAY_ADDRESS
    );

    const withdrawContract = await hre.ethers.getContractAt(
      "TravaWithdraw",
      process.env.TRAVA_WITHDRAW_ADDRESS
    );

    console.log("actionsCallData", actionsCallData);
    console.log("subData", subData);
    console.log("actionIds", actionIds);
    console.log("paramMapping", paramMapping);

    const RecipeExecutorContract = await hre.ethers.getContractAt(
      "RecipeExecutor",
      process.env.RECIPE_EXECUTOR_ADDRESS
    );

    const calldata = RecipeExecutorContract.interface.encodeFunctionData(
      "executeRecipe",
      [
        {
          name: "TravaRecipe",
          callData: actionsCallData,
          subData: subData,
          actionIds: actionIds,
          paramMapping: paramMapping,
        },
      ]
    );

    let tx = await proxy["execute(address,bytes)"](
      RecipeExecutorContract.address,
      calldata,
      {
        gasLimit: 20000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
  });
});
