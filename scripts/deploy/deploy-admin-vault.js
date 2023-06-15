const { ethers } = require("hardhat");
const { writeToEnvFile } = require("../utils/helper");
require("dotenv").config();

async function main() {
  const AdminVault = await ethers.getContractFactory("AdminVault");
  const adminValut = await AdminVault.deploy();

  await adminValut.deployed();
  console.log("AdminVault deployed at: ", adminValut.address);
  writeToEnvFile("ADMIN_VAULT_ADDRESS", adminValut.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

