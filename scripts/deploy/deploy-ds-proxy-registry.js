const { ethers } = require("hardhat");
const { writeToEnvFile } = require("../utils/helper");

require("dotenv").config();

async function main() {
  const DSProxyRegistry = await ethers.getContractFactory("DSProxyRegistry");
  const dsProxyRegistry = await DSProxyRegistry.deploy(process.env.DS_PROXY_FACTORY_ADDRESS);

  await dsProxyRegistry.deployed();
  console.log("DSProxyRegistry deployed at: ", dsProxyRegistry.address);
  writeToEnvFile("DS_PROXY_REGISTRY_ADDRESS", dsProxyRegistry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

