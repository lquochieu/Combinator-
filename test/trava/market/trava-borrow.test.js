const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { expect } = require("chai");
const { getProxy } = require("../utils");

describe("Trava-Borrow", function () {
  this.timeout(150000);

  it("Test trava borrow", async () => {
    const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330";
    const tokenAddress = process.env.WBNB_BSCTESTNET;
    const amount = 1e6;
    const to = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;
    const enableAsColl = false;
    const trava = "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435";

    console.log("prepare borrow");

    const traveBorrow = new Action(
      "TravaBorrow",
      process.env.TRAVA_BORROW_ADDRESS,
      ["address", "address", "uint256", "address", "address"],
      [market, trava, amount, to, onBehalf]
    );

    const calldata = traveBorrow.encodeForDsProxyCall()[1];
    console.log("calldata", calldata);

    // const IERC20 = await hre.ethers.getContractAt("IERC20Test", trava);
    // await IERC20.approve(proxy.address, amount);

    const borrowContract = await hre.ethers.getContractAt(
      "TravaBorrow",
      process.env.TRAVA_BORROW_ADDRESS
    );

    // call receive function in proxy contract to send BNB to proxy
    // const ownerAcc = (await hre.ethers.getSigners())[0];
    // await ownerAcc.sendTransaction({
    //   to: proxy.address,
    //   value: amount + amount,
    // });

    let tx = await proxy["execute(address,bytes)"](
      borrowContract.address,
      calldata,
      {
        gasLimit: 20000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
    //        console.log("ok")
  });
});
