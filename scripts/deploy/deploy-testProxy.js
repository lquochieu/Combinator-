const { ethers } = require("hardhat");
const { writeToEnvFile } = require("../utils/helper");

require("dotenv").config();

async function main() {
  const Test = await ethers.getContractFactory("Test");
  const test = await Test.deploy(process.env.ERC20MOCK);
  await test.deployed();

  console.log("Test deployed at: ", test.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
