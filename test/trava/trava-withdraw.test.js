const {
    travaV2assetsDefaultMarket,
} = require('../utils-trava');

const {
    redeploy,
} = require('../utils');
 
const { travaWithdrawTest } = require('./trava-tests');
const { writeToEnvFile } = require('../../scripts/utils/helper');

describe('Trava-Withdraw', function () {
    this.timeout(150000);

    before(async () => {
        let travaWithdraw = await redeploy('TravaWithdraw');
        console.log("TravaWithdraw deployed", travaWithdraw.address);
        writeToEnvFile("TRAVA_WITHDRAW", travaWithdraw.address);
        let travaBorow = await redeploy('TravaBorrow');
        console.log("TravaBorrow deployed", travaBorow.address);
        writeToEnvFile("TRAVA_BORROW", travaBorow.address);
        let travaSupply = await redeploy('TravaSupply');
        console.log("TravaSupply deployed", travaSupply.address);
        writeToEnvFile("TRAVA_SUPPLY", travaSupply.address);
    });
    it('... should run full trava withdraw test', async () => {
        await travaWithdrawTest(travaV2assetsDefaultMarket.length, "0x6df52f798740504c24ccd374cf7ce81b28ce8330");
    });
});
