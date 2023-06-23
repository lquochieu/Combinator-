const { writeToEnvFile } = require("../utils/helper");
require("dotenv").config();

async function main() {
    const res = await redeploy('StrategyProxy', process.env.DFS_REGISTRY_ADDRESS);
    writeToEnvFile("STRATEGY_PROXY_ADDRESS", res.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

