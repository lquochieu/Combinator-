const { ethers } = require("hardhat");
const { writeToEnvFile } = require("../utils/helper");
const { deployAsOwner } = require("../utils/deployer");
const {owner} = require("../sdk/rdOwner")
require("dotenv").config();

async function main() {
  const signer = owner;
    const adminVault = await deployAsOwner('AdminVault', signer);

    await changeConstantInFiles(
        './contracts',
        ['MainnetAuthAddresses'],
        'ADMIN_VAULT_ADDR',
        adminVault.address,
    );

    await run('compile');

    writeToEnvFile("ADMIN_VAULT_ADDRESS", adminVault.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

