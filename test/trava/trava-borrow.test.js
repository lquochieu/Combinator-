const hre = require("hardhat");
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require("../teststrategy/Action");
const { expect } = require("chai");

describe("Trava-Borrow", function () {
  this.timeout(150000);

  it("Test trava borrow", async () => {
    const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330";
    const tokenAddress = process.env.WBNB_BSCTESTNET;
    const amount = 1e12;
    const to = process.env.PUBLIC_KEY;

    const DsProxyRegistry = await hre.ethers.getContractAt(
      "DSProxyRegistry",
      process.env.DS_PROXY_REGISTRY_ADDRESS
    );

    const userDsProxyAddress = await DsProxyRegistry.proxies(
      process.env.PUBLIC_KEY
    );
    // console.log("userDsProxyAddress", userDsProxyAddress);

    const dsProxy = await hre.ethers.getContractAt(
      "DSProxy",
      userDsProxyAddress
    );

    expect(await dsProxy.owner()).to.be.equal(process.env.PUBLIC_KEY);
    console.log("dsProxy", dsProxy.address);

    const onBehalf = dsProxy.address;
    const enableAsColl = false;
    console.log("prepare borrow");

    const traveBorrow = new Action(
      "TravaBorrow",
      process.env.TRAVA_BORROW,
      ["address", "address", "uint256", "address", "address"],
      [market, tokenAddress, amount, to, onBehalf]
    );

    const calldata = traveBorrow.encodeForRecipe()[0];
    //console.log("calldata", calldata)

    const subdata = [
      abiCoder.encode(["address"], [market]),
      abiCoder.encode(["address"], [tokenAddress.toString()]),
      abiCoder.encode(["uint256"], [amount.toString()]),
      abiCoder.encode(["address"], [to.toString()]),
      abiCoder.encode(["address"], [onBehalf.toString()]),
      abiCoder.encode(["bool"], [enableAsColl]),
    ];
    //console.log("subdata", subdata)

    const parramMapping = traveBorrow.encodeForRecipe()[3];
    //console.log("parramMapping", parramMapping)

    const returnValues =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    //console.log("returnValues", returnValues)

    const borrowInput = {
      calldata: calldata,
      subdata: subdata,
      parramMapping: [parramMapping],
      returnValues: returnValues,
    };

    console.log(borrowInput);

    const borrowContract = await hre.ethers.getContractAt(
      "TravaBorrow",
      process.env.TRAVA_BORROW_ADDRESS
    );

    console.log("start Borrow");

    const borrowCalldata = await borrowContract.interface.encodeFunctionData(
      "executeAction",
      [calldata, subdata, [parramMapping], [returnValues]]
    );

    // console.log("borrowCalldata", borrowCalldata);

    // approve dsproxy to spend native token
    // await dsProxy.execute(borrowContract.address, borrowCalldata);

    // console.log("start Borrow")
    // // const travaBorrow = await borrowContract.executeAction(calldata, subdata, [parramMapping], [returnValues]);
    // const travaBorrow = await borrowContract.executeActionDirect(calldata);
    const calldataBorrow2 = await borrowContract.interface.encodeFunctionData(
      "executeActionDirect",
      [calldata]
    );

    // await dsProxy.execute(borrowContract.address, calldataBorrow2);

    const ERC20MOCK = await hre.ethers.getContractAt(
      "ERC20Mock",
      process.env.ERC20MOCK
    );
    const Test = await hre.ethers.getContractAt("Test", process.env.TEST);

    // check balance
    // const balance = await ERC20MOCK.balanceOf(process.env.PUBLIC_KEY);
    // console.log("balance", hre.ethers.utils.formatEther(balance));
    // approve dsproxy to spend native token
    // await ERC20MOCK.approve(dsProxy.address, hre.ethers.utils.parseEther("1"));

    // // transfer token to dsproxy
    // await ERC20MOCK.transfer(dsProxy.address, hre.ethers.utils.parseEther("1"));
    // console.log("ERC20MOCK", ERC20MOCK.address);
    let calldataSet = await Test.interface.encodeFunctionData("setToken", [
      ERC20MOCK.address,
    ]);
    console.log("calldataSet", calldataSet);
    await dsProxy.execute(Test.address, calldataSet);

    let calldataTransefer = await Test.interface.encodeFunctionData(
      "transferToken",
      [
        "0x33786f26Bac6Bdbf1F4CA29bf70c98453fd8FB32",
        hre.ethers.utils.parseEther("1"),
      ]
    );

    await dsProxy.execute(Test.address, calldataTransefer);

    //        console.log("ok")
  });
});
