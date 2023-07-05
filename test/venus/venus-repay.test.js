const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { getProxy } = require("../utils");

describe("Venus-Payback", function () {
  this.timeout(150000);

  it("Test venus payback", async () => {
    const venusAddress = process.env.VENUS_TOKEN_ADDRESS;
    const xvenusAddress = "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E";
    const amount = 1e14;
    const from = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const onBehalf = proxy.address;

    const IERC20 = await hre.ethers.getContractAt("IERC20Test", xvenusAddress);
    await IERC20.approve(proxy.address, amount);

    console.log("prepare paypack");

    const venusPayback = new Action(
      "VenusPayback",
      process.env.VENUS_PAYBACK_ADDRESS,
      ["address", "uint256", "address", "address"],
      [xvenusAddress, amount, from, onBehalf]
    );

    const calldata = venusPayback.encodeForDsProxyCall()[1];

    const repayContract = await hre.ethers.getContractAt(
      "VenusPayback",
      process.env.VENUS_PAYBACK_ADDRESS
    );

    // call receive function in proxy contract to send BNB to proxy
    // const ownerAcc = (await hre.ethers.getSigners())[0];
    // await ownerAcc.sendTransaction({
    //   to: proxy.address,
    //   value: amount + amount,
    // });

    let tx = await proxy["execute(address,bytes)"](
      repayContract.address,
      calldata,
      {
        gasLimit: 20000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
  });
});
