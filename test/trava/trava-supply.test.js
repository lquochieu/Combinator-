const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { supplyTrava, executeAction } = require("../actions");
const { getProxy } = require("../utils");

describe("Trava-Supply", function () {
  this.timeout(150000);

  it("Test trava supply", async () => {
    const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330";
    const tokenAddress = process.env.WBNB_BSCTESTNET;
    const amount = hre.ethers.utils.parseEther("1");
    const from = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;
    const enableAsColl = false;
    const trava = "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435";

    const IERC20 = await hre.ethers.getContractAt("IERC20Test", trava);
    await IERC20.approve(proxy.address, amount);

    console.log("prepare supply");

    const traveSupply = new Action(
      "TravaSupply",
      process.env.TRAVA_SUPPLY_ADDRESS,
      ["address", "address", "uint256", "address", "address", "bool"],
      [market, trava, amount, from, onBehalf, enableAsColl]
    );

    // const calldata = traveSupply.encodeForRecipe()[0];
    const callData = traveSupply.encodeForDsProxyCall()[1];

    console.log("callData", callData);

    const supplyContract = await hre.ethers.getContractAt(
      "TravaSupply",
      process.env.TRAVA_SUPPLY_ADDRESS
    );

    // call receive function in proxy contract to send BNB to proxy
    // const ownerAcc = (await hre.ethers.getSigners())[0];
    // await ownerAcc.sendTransaction({
    //   to: proxy.address,
    //   value: amount + amount,
    // });

    let tx = await proxy["execute(address,bytes)"](
      supplyContract.address,
      callData,
      {
        gasLimit: 20000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
  });
});
