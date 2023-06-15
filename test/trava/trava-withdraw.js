const {
    travaV2assetsDefaultMarket,
} = require('../utils-trava');

const {
    redeploy,
} = require('../utils');

const { travaWithdrawTest } = require('./trava-tests');

describe('Trava-Withdraw', function () {
    this.timeout(150000);

    before(async () => {
        await redeploy('TravaWithdraw');
        await redeploy('TravaBorrow');
        await redeploy('TravaSupply');
    });
    it('... should run full trava withdraw test', async () => {
        await travaWithdrawTest(travaV2assetsDefaultMarket.length);
    });
});
