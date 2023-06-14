const { ethers } = require("hardhat");

let user1, user2, user3;

let dsAuth, DSAuth;
let dsGuardFactory, DsGuardFactory;

beforeEach(async () => {
  [user1, user2, user3] = await ethers.getSigners();

  DSAuth = await ethers.getContractFactory("DSAuth");
  dsAuth = await DSAuth.deploy();
  await dsAuth.deployed();

  DsGuardFactory = await ethers.getContractFactory("DSGuardFactory");
  dsGuardFactory = await DsGuardFactory.deploy();
  await dsGuardFactory.deployed();
});

describe("DSAuth", () => {
  it("Should deploy DSAuth", async () => {
    console.log("DSAuth deployed to:", dsAuth.address);
    console.log("DsGuardFactory deployed to:", dsGuardFactory.address);
  });
});
