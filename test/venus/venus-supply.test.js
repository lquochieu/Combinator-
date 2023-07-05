const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");

const { getProxy } = require("../utils");

describe("Venus-Supply", function () {
  this.timeout(150000);

  it("Test venus supply", async () => {
    const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330";
    const venusAddress = process.env.VENUS_TOKEN_ADDRESS;
    const xvenusAddress = "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E";
    const amount = hre.ethers.utils.parseEther("1");
    const from = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;
    const enableAsColl = false;

    console.log("prepare supply");

    const IERC20 = await hre.ethers.getContractAt("IERC20Test", venusAddress);
    await IERC20.approve(proxy.address, amount);

    // await IERC20.transfer(proxy.address, amount);

    const venusSupply = new Action(
      "VenusSupply",
      process.env.VENUS_SUPPLY_ADDRESS,
      ["address", "uint256", "address", "bool"],
      [xvenusAddress, amount, from, enableAsColl]
    );

    const callData = venusSupply.encodeForDsProxyCall()[1];

    const supplyContract = await hre.ethers.getContractAt(
      "VenusSupply",
      process.env.VENUS_SUPPLY_ADDRESS
    );

    let tx = await proxy["execute(address,bytes)"](
      supplyContract.address,
      callData,
      {
        gasLimit: 20000000,
      }
    );

    console.log("tx", tx);
    // );
    // const IERC20 = await hre.ethers.getContractAt("IERC20Test", trava);
    // await IERC20.approve(proxy.address, amount);

    // console.log("prepare supply");

    // const traveSupply = new Action(
    //   "TravaSupply",
    //   process.env.TRAVA_SUPPLY,
    //   ["address", "address", "uint256", "address", "address", "bool"],
    //   [market, trava, amount, from, onBehalf, enableAsColl]
    // );

    // // const calldata = traveSupply.encodeForRecipe()[0];
    // const callData = traveSupply.encodeForDsProxyCall()[1];

    // console.log("callData", callData);

    // const supplyContract = await hre.ethers.getContractAt(
    //   "TravaSupply",
    //   process.env.TRAVA_SUPPLY_ADDRESS
    // );

    // // call receive function in proxy contract to send BNB to proxy

    // let tx = await proxy["execute(address,bytes)"](
    //   supplyContract.address,
    //   callData,
    //   {
    //     gasLimit: 20000000,
    //   }
    // );

    // tx = await tx.wait();
    // console.log("tx", tx);
  });
});
