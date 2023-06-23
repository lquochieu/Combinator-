const { writeToEnvFile } = require("../utils/helper");
require("dotenv").config();

async function main() {
    const proxyAuth = await redeploy('ProxyAuth', process.env.DFS_REGISTRY_ADDRESS);

    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'PROXY_AUTH_ADDR',
        proxyAuth.address,

    );
    await run('compile');
    
    writeToEnvFile("PROXY_AUTH_ADDRESS", strategyStorage.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

