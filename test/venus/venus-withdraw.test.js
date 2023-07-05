const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { getProxy } = require("../utils");

describe("Venus-Withdraw", function () {
  this.timeout(150000);

  it("Test venus withdraw", async () => {
    const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330";
    const tokenAddress = process.env.WBNB_BSCTESTNET;
    const amount = hre.ethers.utils.parseEther("1");
    const venusAddress = process.env.VENUS_TOKEN_ADDRESS;
    const xvenusAddress = "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E";
    const to = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;
    const enableAsColl = false;
    const trava = "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435";

    console.log("prepare withdraw");

    const venusWithdraw = new Action(
      "VenusWithdraw",
      process.env.VENUS_WITHDRAW_ADDRESS,
      ["address", "uint256", "address"],
      [xvenusAddress, amount, to]
    );

    const calldata = venusWithdraw.encodeForDsProxyCall()[1];

    const withdrawContract = await hre.ethers.getContractAt(
      "VenusWithdraw",
      process.env.VENUS_WITHDRAW_ADDRESS
    );

    let tx = await proxy["execute(address,bytes)"](
      withdrawContract.address,
      calldata,
      {
        gasLimit: 20000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
  });
});
