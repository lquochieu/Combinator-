const { ethers } = require("hardhat");
const { writeToEnvFile } = require("../utils/helper");

require("dotenv").config();

async function main() {
  const DFSRegistry = await ethers.getContractFactory("DFSRegistry");
  const dfsRegistry = await DFSRegistry.deploy();

  await dfsRegistry.deployed();
  console.log("DFSRegistry deployed at: ", dfsRegistry.address);
  writeToEnvFile("DFS_REGISTRY_ADDRESS", dfsRegistry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

