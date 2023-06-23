const { expect } = require("chai");
const { ethers } = require("hardhat");

let user1, user2, user3;

let dsProxyFactory, DSProxyFactory;
let dsProxy, DSProxy;
let token, Token;
let test, Test;

beforeEach(async () => {
  [user1, user2, user3] = await ethers.getSigners();

  DSProxyFactory = await ethers.getContractFactory("DSProxyFactory");
  dsProxyFactory = await DSProxyFactory.deploy();
  await dsProxyFactory.deployed();

  Token = await ethers.getContractFactory("ERC20Mock");
  token = await Token.deploy("Test Token", "TUSD");
  await token.deployed();
  await token.mint(user1.address, ethers.utils.parseEther("1000"));

  Test = await ethers.getContractFactory("Test");
  test = await Test.deploy(token.address);
  await test.deployed();

  // await token.approve(test.address, ethers.utils.parseEther("1000"));
});

describe("DSProxyFactory", () => {
  it("Should deploy DSProxy", async () => {
    console.log("DSProxyFactory deployed to:", dsProxyFactory.address);
    console.log("Test deployed to:", test.address);
    console.log("Token deployed to:", token.address);
  });

  it("build proxy", async () => {
    await dsProxyFactory.build(); // real project must be listen event

    const user1Proxy = await dsProxyFactory.listProxy(user1.address, 0);
    // console.log("user1Proxy", user1Proxy);

    dsProxy = await ethers.getContractAt("DSProxy", user1Proxy);
    console.log("dsProxy", dsProxy.address);

    // approve proxy to spend token
    await token.approve(dsProxy.address, ethers.utils.parseEther("100"));
    // await test.transfer(user2.address, ethers.utils.parseEther("1"));
    let calldata = await test.interface.encodeFunctionData("setToken", [
      token.address,
    ]);
    console.log("calldata", calldata);
    await dsProxy.execute(test.address, calldata);

    calldata = await test.interface.encodeFunctionData("transferToken", [
      "0x33786f26Bac6Bdbf1F4CA29bf70c98453fd8FB32",
      ethers.utils.parseEther("1"),
    ]);

    // user2 balance  before transfer
    const user2Balance = await token.balanceOf(
      "0x33786f26Bac6Bdbf1F4CA29bf70c98453fd8FB32"
    );
    await dsProxy.execute(test.address, calldata);
    // user2 balance after transfer
    const user2BalanceAfter = await token.balanceOf(
      "0x33786f26Bac6Bdbf1F4CA29bf70c98453fd8FB32"
    );

    const changeBalance = ethers.BigNumber.from(user2BalanceAfter).sub(
      ethers.BigNumber.from(user2Balance)
    );

    console.log("changeBalance", changeBalance);
    expect(changeBalance).to.equal(ethers.utils.parseEther("1"));
    // test excute but don't work :)
    // calldata = await test.interface.encodeFunctionData("transferToken", [
    //   user2.address,
    //   ethers.utils.parseEther("2"),
    // ]);

    // // get test contract bytecode
    // const TestBytecode = await ethers.provider.getCode(test.address);
    // console.log("TestBytecode", TestBytecode);
    // await dsProxy.execute(TestBytecode, calldata);
  });
});
