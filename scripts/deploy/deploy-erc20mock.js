const { ethers } = require("hardhat");
const { writeToEnvFile } = require("../utils/helper");

require("dotenv").config();

async function main() {
  const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
  const erc20Mock = await ERC20Mock.deploy("ERC20Mock", "TMK");
  await erc20Mock.deployed();
  console.log("ERC20Mock deployed at: ", erc20Mock.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
