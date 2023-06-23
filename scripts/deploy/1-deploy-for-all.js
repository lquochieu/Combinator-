/* eslint-disable import/no-extraneous-dependencies */

const hre = require('hardhat');
const fs = require('fs');
const { deployAsOwner } = require('../utils/deployer');
const { start } = require('../utils/starter');

const { changeConstantInFiles } = require('../utils/utils');

const { redeploy } = require('../../test/utils');
const { owner } = require("../sdk/rdOwner");
const { writeToEnvFile } = require('../utils/helper');

// const { topUp } = require('../utils/fork');

async function main() {
    //await topUp(OWNER_ACC);

    // get signer
    const signer = owner;

    /*
        ||--------------------------------------------------------------------------------||
        ||                                 Logger Contract                                || 
        ||--------------------------------------------------------------------------------||
    */
    const defiSaverLogger = await deployAsOwner('DefisaverLogger', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'DEFISAVER_LOGGER',
        defiSaverLogger.address,
    );
    await run('compile');
    writeToEnvFile("DEFISAVER_LOGGER_ADDRESS", defiSaverLogger.address)

    /*
    ||--------------------------------------------------------------------------------||
    ||                                   DS Contract                                  || 
    ||--------------------------------------------------------------------------------||
*/
    // DSGuardFactory
    const dsGuardFactory = await deployAsOwner('DSGuardFactory', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetAuthAddresses'],
        'FACTORY_ADDRESS',
        dsGuardFactory.address,
    );
    await run('compile');
    writeToEnvFile("DS_GUARD_FACTORY_ADDRESS", dsGuardFactory.address)

    // DSProxyFactory
    const dsProxyFactory = await deployAsOwner('DSProxyFactory', signer);
    writeToEnvFile("DS_PROXY_FACTORY_ADDRESS", dsProxyFactory.address)

    // DSProxyRegistry
    const proxyRegistry = await deployAsOwner('DSProxyRegistry', signer, dsProxyFactory.address);
    writeToEnvFile("DS_PROXY_REGISTRY_ADDRESS", proxyRegistry.address)

    /*
        ||--------------------------------------------------------------------------------||
        ||                                 Auth Contract                                  || 
        ||--------------------------------------------------------------------------------||
    */
    const adminVault = await deployAsOwner('AdminVault', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetAuthAddresses'],
        'ADMIN_VAULT_ADDR',
        adminVault.address,
    );
    await run('compile');
    writeToEnvFile("ADMIN_VAULT_ADDRESS", adminVault.address)

    /*
        ||--------------------------------------------------------------------------------||
        ||                                 Core Contract                                  || 
        ||--------------------------------------------------------------------------------||
    */
    // DFSRegistry
    const reg = await deployAsOwner('DFSRegistry', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetActionsUtilAddresses', 'MainnetCoreAddresses'],
        'REGISTRY_ADDR',
        reg.address,
    );
    await run('compile');
    writeToEnvFile("DFS_REGISTRY_ADDRESS", reg.address);

    // StrategyStorage
    const strategyStorage = await redeploy('StrategyStorage', reg.address);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'STRATEGY_STORAGE_ADDR',
        strategyStorage.address,
    );
    await run('compile');
    writeToEnvFile("STRATEGY_STORAGE_ADDRESS", strategyStorage.address);


    // BundleStorage
    const bundleStorage = await redeploy('BundleStorage', reg.address);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'BUNDLE_STORAGE_ADDR',
        bundleStorage.address,
    );
    await run('compile');
    writeToEnvFile("BUNDLE_STORAGE_ADDRESS", bundleStorage.address)

    // ProxyAuth
    const proxyAuth = await redeploy('ProxyAuth', reg.address);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'PROXY_AUTH_ADDR',
        proxyAuth.address,

    );
    writeToEnvFile("PROXY_AUTH_ADDRESS", proxyAuth.address)

    // SubStorage
    const subStorage = await redeploy('SubStorage', reg.address);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'SUB_STORAGE_ADDR',
        subStorage.address,
    );
    await run('compile');
    writeToEnvFile("SUB_STORAGE_ADDRESS", subStorage.address)

    // SubProxy
    const subProxy = await redeploy('SubProxy', reg.address);
    writeToEnvFile("SUB_PROXY_ADDRESS", subProxy.address)

    // StrategyProxy
    const strategyProxy = await redeploy('StrategyProxy', reg.address);
    writeToEnvFile("STRATEGY_PROXY_ADDRESS", strategyProxy.address)

    // RecipeExecutor
    const recipeExecutor = await redeploy('RecipeExecutor', reg.address);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'RECIPE_EXECUTOR_ADDR',
        recipeExecutor.address,
    );
    await run('compile');
    writeToEnvFile("RECIPE_EXECUTOR_ADDRESS", recipeExecutor.address)


    const strategyExecutor = await redeploy('StrategyExecutor', reg.address);
    writeToEnvFile("STRATEGY_EXECUTOR_ADDRESS", strategyExecutor.address)

    const botAuth = await redeploy('BotAuth', reg.address);
    writeToEnvFile("BOT_AUTH_ADDRESS", botAuth.address)


    // // mcd actions
    // await redeploy('McdSupply', reg.address);
    // await redeploy('McdWithdraw', reg.address);
    // await redeploy('McdGenerate', reg.address);
    // await redeploy('McdPayback', reg.address);
    // await redeploy('McdOpen', reg.address);
    // await redeploy('BotAuth', reg.address);
    // await redeploy('GasFeeTaker', reg.address);

    // await addBotCaller('0x61fe1bdcd91E8612a916f86bA50a3EDF3E5654c4', reg.address);
    // await addBotCaller('0x660B3515F493200C47Ef3DF195abEAfc57Bd6496', reg.address);
    // await addBotCaller('0x4E4cF1Cc07C7A1bA00740434004163ac2821efa7', reg.address);

    // // exchange
    // await redeploy('DFSSell', reg.address);
}

start(main);
