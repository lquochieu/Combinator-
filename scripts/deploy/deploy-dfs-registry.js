const { ethers } = require("hardhat");
const { writeToEnvFile } = require("../utils/helper");
const { deployAsOwner } = require("../utils/deployer");
const {owner} = require("../sdk/rdOwner")
require("dotenv").config();

async function main() {
  const signer = owner;
  const reg = await deployAsOwner('DFSRegistry', signer);

    await changeConstantInFiles(
        './contracts',
        ['MainnetActionsUtilAddresses', 'MainnetCoreAddresses'],
        'REGISTRY_ADDR',
        reg.address,
    );

    await run('compile');

    writeToEnvFile("DFS_REGISTRY_ADDRESS", reg.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

