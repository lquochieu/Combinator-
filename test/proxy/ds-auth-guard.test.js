const { ethers, waffle } = require("hardhat");
const { expect } = require("chai");

let user1, user2, user3;

let dsAuth, DSAuth;
let dsGuardFactory, DsGuardFactory;
let dsGuard, DsGuard;
let token, Token;
let test, Test;
let ANY;

beforeEach(async () => {
  [user1, user2, user3] = await ethers.getSigners();

  DSAuth = await ethers.getContractFactory("DSAuth");
  dsAuth = await DSAuth.deploy();
  await dsAuth.deployed();

  DsGuardFactory = await ethers.getContractFactory("DSGuardFactory");
  dsGuardFactory = await DsGuardFactory.deploy();
  await dsGuardFactory.deployed();

  Token = await ethers.getContractFactory("ERC20Mock");
  token = await Token.deploy("Test Token", "TUSD");
  await token.deployed();
  await token.mint(user1.address, ethers.utils.parseEther("1000"));

  Test = await ethers.getContractFactory("Test");
  test = await Test.deploy(token.address);
  await test.deployed();

  await dsGuardFactory.newGuard();
  let guardAddress = await dsGuardFactory.created(user1.address, 0);

  dsGuard = await ethers.getContractAt("DSGuard", guardAddress);

  let ownerGuard = await dsGuard.owner();
  expect(ownerGuard).to.equal(user1.address);

  // set authority
  await dsGuard.setAuthority(dsGuard.address);

  ANY = await dsGuard.ANY();
});

describe("DSAuthAndGuard", () => {
  it("Should deploy DSAuth and DSGuard", async () => {
    console.log("DSAuth deployed to:", dsAuth.address);
    console.log("DsGuardFactory deployed to:", dsGuardFactory.address);
  });

  it("Test Permit Any", async () => {
    await dsGuard.permit(test.address, token.address, ANY);

    let cancal = await dsGuard.canCall(
      test.address,
      token.address,
      "0x12345678"
    );
    expect(cancal).to.equal(true);
  });

  it("Test Forbid Any", async () => {
    await dsGuard.forbid(test.address, token.address, ANY);

    let cancal = await dsGuard.canCall(
      test.address,
      token.address,
      "0x12345678"
    );

    expect(cancal).to.equal(false);
  });
});
