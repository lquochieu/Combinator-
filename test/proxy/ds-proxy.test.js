const { ethers } = require("hardhat");

let user1, user2, user3;

let dsProxyFactory, DSProxyFactory;

beforeEach(async () => {
  [user1, user2, user3] = await ethers.getSigners();
  DSProxyFactory = await ethers.getContractFactory("DSProxyFactory");
  dsProxyFactory = await DSProxyFactory.deploy();

  await dsProxyFactory.deployed();
});

describe("DSProxyFactory", () => {
  it("Should deploy DSProxy", async () => {
    console.log("DSProxyFactory deployed to:", dsProxyFactory.address);
  });

  it("build proxy", async () => {
    let proxy = await dsProxyFactory.build();
    console.log("proxy deployed to:", proxy);
  });
});
