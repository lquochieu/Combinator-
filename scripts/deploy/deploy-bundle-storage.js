const { writeToEnvFile } = require("../utils/helper");
require("dotenv").config();

async function main() {
    const bundleStorage = await redeploy('BundleStorage', process.env.DFS_REGISTRY_ADDRESS);

    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'BUNDLE_STORAGE_ADDR',
        bundleStorage.address,
    );

    await run('compile');
    
    writeToEnvFile("BUNDLE_STORAGE_ADDRESS", strategyStorage.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

