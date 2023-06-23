const { writeToEnvFile } = require("../utils/helper");
require("dotenv").config();

async function main() {
    const subStorage = await redeploy('SubStorage', process.env.DFS_REGISTRY_ADDRESS);  
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'SUB_STORAGE_ADDR',
        subStorage.address,
    );
    await run('compile');
    writeToEnvFile("SUB_STORAGE_ADDRESS", subStorage.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

