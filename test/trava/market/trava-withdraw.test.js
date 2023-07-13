const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../../teststrategy/Action");
const { getProxy } = require("../../utils");

describe("Trava-Withdraw", function () {
  this.timeout(150000);

  it("Test trava withdraw", async () => {
    const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330";
    const tokenAddress = process.env.WBNB_BSCTESTNET;
    const amount = hre.ethers.utils.parseEther("1");
    const to = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;
    const enableAsColl = false;
    const trava = "0xE1F005623934D3D8C724EC68Cc9bFD95498D4435";

    console.log("prepare withdraw");

    const traveWithdrawAction = new Action(
      "TravaWithdraw",
      process.env.TRAVA_WITHDRAW_ADDRESS,
      ["address", "address", "uint256", "address"],
      [market, trava, amount, to]
    );

    const calldata = traveWithdrawAction.encodeForDsProxyCall()[1];

    const withdrawContract = await hre.ethers.getContractAt(
      "TravaWithdraw",
      process.env.TRAVA_WITHDRAW_ADDRESS
    );

    // call receive function in proxy contract to send BNB to proxy
    // const ownerAcc = (await hre.ethers.getSigners())[0];
    // await ownerAcc.sendTransaction({
    //   to: proxy.address,
    //   value: amount + amount,
    // });

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
