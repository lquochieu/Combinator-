const { ethers } = require("hardhat");
const { expect } = require("chai");

let dsProxyRegistry,
  DsProxyRegistry,
  dsProxyFactory,
  DSProxyFactory,
  dsProxy,
  DSProxy,
  dfsProxyRegistryController,
  DFSProxyRegistryController,
  dfsRegistry,
  DFSRegistry,
  dfsProxyRegistry,
  DFSProxyRegistry,
  adminVault,
  AdminVault,
  user1,
  user2,
  user3;

before(async function () {
  [user1, user2, user3] = await ethers.getSigners();

  // DFSRegistry contract
  DFSRegistry = await ethers.getContractFactory("TestDFSRegistry");
  dfsRegistry = await DFSRegistry.deploy();
  await dfsRegistry.deployed();

  // DFSProxyRegistry contract
  DFSProxyRegistry = await ethers.getContractFactory("TestDFSProxyRegistry");
  dfsProxyRegistry = await DFSProxyRegistry.deploy();
  await dfsProxyRegistry.deployed();

  // DFSProxyRegistryController contract
  DFSProxyRegistryController = await ethers.getContractFactory(
    "TestDFSProxyRegistryController"
  );
  dfsProxyRegistryController = await DFSProxyRegistryController.deploy();
  await dfsProxyRegistryController.deployed();

  // DSProxyFactory contract
  DSProxyFactory = await ethers.getContractFactory("DSProxyFactory");
  dsProxyFactory = await DSProxyFactory.deploy();
  await dsProxyFactory.deployed();

  // DSProxyRegistry contract
  DsProxyRegistry = await ethers.getContractFactory("DSProxyRegistry");
  dsProxyRegistry = await DsProxyRegistry.deploy(dsProxyFactory.address);
  await dsProxyRegistry.deployed();

  // AdminVault contract
  AdminVault = await ethers.getContractFactory("TestAdminVault");
  adminVault = await AdminVault.deploy();
  await adminVault.deployed();
});

describe("DFS test", () => {
  it("All contracts should be deployed", async () => {
    console.log("DFSRegistry deployed to:", dfsRegistry.address);
    console.log("DFSProxyRegistry deployed to:", dfsProxyRegistry.address);
    console.log(
      "DFSProxyRegistryController deployed to:",
      dfsProxyRegistryController.address
    );
    console.log("DSProxyFactory deployed to:", dsProxyFactory.address);
    console.log("DsProxyRegistry deployed to:", dsProxyRegistry.address);
    console.log("AdminVault deployed to:", adminVault.address);
  });

  it("Should be address of testnet", async () => {
    const mcdRegistry = await dfsProxyRegistry.mcdRegistry();
    expect(mcdRegistry).to.equal("0xf79B1521c352294d65d9447A63B974A57F4a9D0b");

    const registry = await dfsProxyRegistry.registry();
    expect(registry).to.equal("0x5729494DA09117516e8F4655Ecfe0bdf928fF847");
  });

  it("Should dfs proxy registry controller work", async () => {
    // add new contract to registry in dfs registry
    await dfsRegistry.addNewContract(
      "0xcbbb53f2",
      dfsProxyRegistryController.address,
      0
    );

    // add to pool 10 proxy
    await dfsProxyRegistryController.addToPool(10);

    // // add new proxy to user1
    await dfsProxyRegistryController.addNewProxy();

    let allProxyUser1 = await dfsProxyRegistry.getAllProxies(user1.address);

    // console.log("allProxyUser1", allProxyUser1);

    let allProxyUser2 = await dfsProxyRegistry.getAllProxies(user2.address);

    // console.log("allProxyUser2", allProxyUser2);

    // change owner of proxy

    dsProxy = await ethers.getContractAt("DSProxy", allProxyUser1[1][0]);
    let dsProxyOwner = await dsProxy.owner();
    expect(dsProxyOwner).to.equal(user1.address);

    let calldata =
      await dfsProxyRegistryController.interface.encodeFunctionData(
        "changeOwnerInDFSRegistry",
        [user2.address]
      );

    // await dsProxy.executeTarget(dfsProxyRegistryController.address, calldata);
    // await dfsProxyRegistryController.changeOwnerInDFSRegistry(user2.address);
  });
});
