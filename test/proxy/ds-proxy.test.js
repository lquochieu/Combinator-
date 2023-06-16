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

  await token.approve(test.address, ethers.utils.parseEther("1000"));
});

describe("DSProxyFactory", () => {
  it("Should deploy DSProxy", async () => {
    console.log("DSProxyFactory deployed to:", dsProxyFactory.address);
    console.log("Test deployed to:", test.address);
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
    await dsProxy.execute(test.address, calldata);

    calldata = await test.interface.encodeFunctionData("transferToken", [
      user2.address,
      ethers.utils.parseEther("1"),
    ]);

    await dsProxy.execute(test.address, calldata);

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
