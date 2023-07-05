const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { expect } = require("chai");
const { getProxy } = require("../utils");

describe("Venus-Borrow", function () {
  this.timeout(150000);

  it("Test venus borrow", async () => {
    const tokenAddress = process.env.VENUS_TOKEN_ADDRESS;
    const xvenusAddress = "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E";
    const amount = 1e3;
    const to = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);

    const enableAsColl = false;

    console.log("prepare borrow");

    const venusBorrow = new Action(
      "VenusBorrow",
      process.env.VENUS_BORROW_ADDRESS,
      ["address", "uint256", "address"],
      [xvenusAddress, amount, to]
    );

    const calldata = venusBorrow.encodeForDsProxyCall()[1];
    console.log("calldata", calldata);

    // const IERC20 = await hre.ethers.getContractAt("IERC20Test", trava);
    // await IERC20.approve(proxy.address, amount);

    const borrowContract = await hre.ethers.getContractAt(
      "VenusBorrow",
      process.env.VENUS_BORROW_ADDRESS
    );

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
