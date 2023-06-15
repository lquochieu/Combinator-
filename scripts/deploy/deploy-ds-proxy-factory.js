const { ethers } = require("hardhat");
const { writeToEnvFile } = require("../utils/helper");

require("dotenv").config();

async function main() {
  const DSProxyFactory = await ethers.getContractFactory("DSProxyFactory");
  const dsProxyFactory = await DSProxyFactory.deploy();

  await dsProxyFactory.deployed();
  console.log("DSProxyFactory deployed at: ", dsProxyFactory.address);
  writeToEnvFile("DS_PROXY_FACTORY_ADDRESS", dsProxyFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

