/* eslint-disable import/no-extraneous-dependencies */

const hre = require('hardhat');
const fs = require('fs');
const { deployAsOwner } = require('../utils/deployer');
const { start } = require('../utils/starter');

const { changeConstantInFiles } = require('../utils/utils');

const { redeploy} = require('../../test/utils');
const {owner} = require("../sdk/rdOwner");
const { writeToEnvFile } = require('../utils/helper');

// const { topUp } = require('../utils/fork');

async function main() {
    //await topUp(OWNER_ACC);
    
    // get signer
    const signer = owner;
    
    /*
        ||--------------------------------------------------------------------------------||
        ||                              Utils Action Contract                             || 
        ||--------------------------------------------------------------------------------||
    */
    const testStrategy = await deployAsOwner('TestStrategy', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetTestStrategyAddresses'],
        'TEST_STRATEGY_ADDRESS',
        testStrategy.address,
    );
    await run('compile');
    writeToEnvFile("TEST_STRATEGY_ADDRESS", testStrategy.address)
    /*
        ||--------------------------------------------------------------------------------||
        ||                                 Action Contract                                || 
        ||--------------------------------------------------------------------------------||
    */

    /*
        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
        ||                           TestStratage Contract                                ||
        ||++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++||
    */
    const testStrategyIncrease = await redeploy('TestStrategyIncrease', process.env.DFS_REGISTRY_ADDRESS);
    writeToEnvFile("TEST_STRATEGY_INCREASE_ADDRESS", testStrategyIncrease.address)

    /*
        ||--------------------------------------------------------------------------------||
        ||                                Trigger Contract                                || 
        ||--------------------------------------------------------------------------------||
    */
    const testStrategyTrigger = await redeploy('TestStrategyTrigger', process.env.DFS_REGISTRY_ADDRESS);
    writeToEnvFile("TEST_STRATEGY_TRIGGER_ADDRESS", testStrategyTrigger.address)
}

start(main);
