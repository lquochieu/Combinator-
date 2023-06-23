const { writeToEnvFile } = require("../utils/helper");
require("dotenv").config();

async function main() {
    const strategyStorage = await redeploy('StrategyStorage', process.env.DFS_REGISTRY_ADDRESS);

    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'STRATEGY_STORAGE_ADDR',
        strategyStorage.address,
    );
    await run('compile');
    
    writeToEnvFile("STRATEGY_STORAGE_ADDRESS", strategyStorage.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

