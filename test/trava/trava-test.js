const { expect } = require('chai');
const hre = require('hardhat');

const { getAssetInfo } = require('@defisaver/tokens');

const {
    getTravaDataProvider,
    getTravaTokenInfo,
    getTravaReserveInfo,
    getTravaReserveData,
    VARIABLE_RATE,
    STABLE_RATE,
    travaV2assetsDefaultMarket,
    getTravaFactoryRegistry,
    getTravaProviderFactory,
    getLendingAddressByProviderId,
    getLendingPool,
} = require('../utils-trava');

const {
    getProxy,
    balanceOf,
    fetchAmountinUSDPrice,
    TRAVA_MARKET,
    WETH_ADDR,
    WBNB_ADDR,
    timeTravel,
    getAddrFromRegistry,
    revertToSnapshot,
    takeSnapshot,
    redeploy,
} = require('../utils');

const {
    supplyTrava,
    borrowTrava,
    withdrawTrava,
    paybackTrava,
    claimStkTrava,
} = require('../actions');

const travaSupplyTest = async (testLength, lendingPoolAddress) => {
    describe('Trava-Supply', function () {
        this.timeout(150000);

        let senderAcc; let proxy; let lendingPool;

        before(async () => {
            senderAcc = (await hre.ethers.getSigners())[0];
            proxy = await getProxy(senderAcc.address);
            lendingPool = await getLendingPool(lendingPoolAddress);
        });

        for (let i = 0; i < testLength; i++) {
            const tokenSymbol = travaV2assetsDefaultMarket[i];
            const fetchedAmountWithUSD = fetchAmountinUSDPrice(tokenSymbol, '10000');

            it(`... should supply ${fetchedAmountWithUSD} ${tokenSymbol} to Trava`, async () => {
                const snapshot = await takeSnapshot();
                const assetInfo = getAssetInfo(tokenSymbol);
                if (assetInfo.symbol === 'ETH') {
                    assetInfo.address = WETH_ADDRESS;
                }

                const travaTokenInfo = await getTravaTokenInfo(dataProvider, assetInfo.address);
                const aToken = travaTokenInfo.aTokenAddress;
                const amount = hre.ethers.utils.parseUnits(
                    fetchedAmountWithUSD,
                    assetInfo.decimals,
                );

                const balanceBefore = await balanceOf(aToken, proxy.address);
                await supplyTrava(proxy, TRAVA_MARKET, amount, assetInfo.address, senderAcc.address);

                const balanceAfter = await balanceOf(aToken, proxy.address);

                expect(balanceAfter).to.be.gt(balanceBefore);
                await revertToSnapshot(snapshot);
            });
        }
    });
};

const travaBorrowTest = async (testLength) => {
    describe('Trava-Borrow', () => {
        let senderAcc; let proxy; let dataProvider;
        before(async () => {
            senderAcc = (await hre.ethers.getSigners())[0];
            proxy = await getProxy(senderAcc.address);
            dataProvider = await getTravaDataProvider();
        });

        for (let i = 0; i < testLength; ++i) {
            const tokenSymbol = travaV2assetsDefaultMarket[i];
            const fetchedAmountWithUSD = fetchAmountinUSDPrice(tokenSymbol, '5000');
            it(`... should variable borrow ${fetchedAmountWithUSD} ${tokenSymbol} from Trava`, async () => {
                const snapshot = await takeSnapshot();
                const assetInfo = getAssetInfo(tokenSymbol);

                if (assetInfo.symbol === 'ETH') {
                    assetInfo.address = WETH_ADDRESS;
                }

                const reserveInfo = await getTravaReserveInfo(dataProvider, assetInfo.address);
                const aTokenInfo = await getTravaTokenInfo(dataProvider, assetInfo.address);
                const reserveData = await getTravaReserveData(dataProvider, assetInfo.address);

                if (!reserveInfo.borrowingEnabled) {
                // eslint-disable-next-line no-unused-expressions
                    expect(true).to.be.true;
                    return;
                }

                const amount = hre.ethers.utils.parseUnits(
                    fetchedAmountWithUSD,
                    assetInfo.decimals,
                );

                if (reserveData.availableLiquidity.lt(amount)) {
                // eslint-disable-next-line no-unused-expressions
                    expect(true).to.be.true;
                    return;
                }

                // eth bada bing bada bum
                await supplyTrava(proxy, TRAVA_MARKET, hre.ethers.utils.parseUnits(fetchAmountinUSDPrice('WETH', '20000'), 18), WETH_ADDRESS, senderAcc.address);

                const balanceBefore = await balanceOf(assetInfo.address, senderAcc.address);
                const debtBalanceBefore = await balanceOf(
                    aTokenInfo.variableDebtTokenAddress,
                    proxy.address,
                );

                await borrowTrava(
                    proxy,
                    TRAVA_MARKET,
                    assetInfo.address,
                    amount,
                    VARIABLE_RATE,
                    senderAcc.address,
                );

                const balanceAfter = await balanceOf(assetInfo.address, senderAcc.address);
                const debtBalanceAfter = await balanceOf(
                    aTokenInfo.variableDebtTokenAddress,
                    proxy.address,
                );

                expect(debtBalanceAfter).to.be.gt(debtBalanceBefore);
                expect(balanceAfter).to.be.gt(balanceBefore);
                await revertToSnapshot(snapshot);
            });

            const fetchedAmountDiv10 = fetchAmountinUSDPrice(tokenSymbol, '500');
            it(`... should stable borrow ${fetchedAmountDiv10} ${tokenSymbol} from Trava`, async () => {
                const snapshot = await takeSnapshot();
                const assetInfo = getAssetInfo(tokenSymbol);

                if (assetInfo.symbol === 'ETH') {
                // can't currently stable borrow if position already has eth
                // eslint-disable-next-line no-unused-expressions
                    expect(true).to.be.true;
                    return;
                // assetInfo.address = WETH_ADDRESS;
                }

                const reserveInfo = await getTravaReserveInfo(dataProvider, assetInfo.address);
                const aTokenInfo = await getTravaTokenInfo(dataProvider, assetInfo.address);
                const reserveData = await getTravaReserveData(dataProvider, assetInfo.address);

                if (!reserveInfo.stableBorrowRateEnabled) {
                // eslint-disable-next-line no-unused-expressions
                    expect(true).to.be.true;
                    return;
                }

                const amount = hre.ethers.utils.parseUnits(
                    fetchedAmountDiv10,
                    assetInfo.decimals,
                );

                if (reserveData.availableLiquidity.lt(amount)) {
                // eslint-disable-next-line no-unused-expressions
                    expect(true).to.be.true;
                    return;
                }

                // eth bada bing bada bum
                await supplyTrava(proxy, TRAVA_MARKET, hre.ethers.utils.parseUnits(fetchAmountinUSDPrice('WETH', '20000'), 18), WETH_ADDRESS, senderAcc.address);

                const balanceBefore = await balanceOf(assetInfo.address, senderAcc.address);
                const debtBalanceBefore = await balanceOf(
                    aTokenInfo.stableDebtTokenAddress,
                    proxy.address,
                );
                await borrowTrava(
                    proxy,
                    TRAVA_MARKET,
                    assetInfo.address,
                    amount,
                    STABLE_RATE,
                    senderAcc.address,
                );

                const balanceAfter = await balanceOf(assetInfo.address, senderAcc.address);
                const debtBalanceAfter = await balanceOf(
                    aTokenInfo.stableDebtTokenAddress,
                    proxy.address,
                );

                expect(debtBalanceAfter).to.be.gt(debtBalanceBefore);
                expect(balanceAfter).to.be.gt(balanceBefore);
                await revertToSnapshot(snapshot);
            });
        }
    });
};

const travaWithdrawTest = async (testLength, lendingPoolAddress) => {
    describe('Trava-Withdraw', function () {
        this.timeout(150000);

        let senderAcc; let proxy; let lendingPool;

        before(async () => {
            senderAcc = (await hre.ethers.getSigners())[0];
            proxy = await getProxy(senderAcc.address);
            lendingPool = await getLendingPool(lendingPoolAddress);
        });

        for (let i = 0; i < testLength; ++i) {
            const tokenSymbol = travaV2assetsDefaultMarket[i];
            const fetchedAmountWithUSD = fetchAmountinUSDPrice(tokenSymbol, '10000');

            it(`... should withdraw ${fetchedAmountWithUSD} ${tokenSymbol} from Trava`, async () => {
                const snapshot = await takeSnapshot();
                const assetInfo = getAssetInfo(tokenSymbol);

                if (assetInfo.symbol === 'WBNB') {
                    assetInfo.address = WBNB_ADDR;
                }

                const travaTokenInfo = await getTravaTokenInfo(dataProvider, assetInfo.address);
                const tToken = travaTokenInfo.tTokenAddress;

                const amount = hre.ethers.utils.parseUnits(
                    fetchedAmountWithUSD,
                    assetInfo.decimals,
                );

                const tBalanceBefore = await balanceOf(tToken, proxy.address);

                if (tBalanceBefore.lte(amount)) {
                    // eslint-disable-next-line max-len
                    await supplyTrava(proxy, TRAVA_MARKET, amount, assetInfo.address, senderAcc.address);
                }

                const balanceBefore = await balanceOf(assetInfo.address, senderAcc.address);

                // eslint-disable-next-line max-len
                await withdrawTrava(proxy, TRAVA_MARKET, assetInfo.address, amount, senderAcc.address);

                const balanceAfter = await balanceOf(assetInfo.address, senderAcc.address);

                expect(balanceAfter).to.be.gt(balanceBefore);
                await revertToSnapshot(snapshot);
            });
        }
    });
};

const travaPaybackTest = async (testLength) => {
    describe('Trava-Payback', function () {
        this.timeout(80000);

        let senderAcc; let proxy; let dataProvider;

        before(async () => {
            senderAcc = (await hre.ethers.getSigners())[0];
            proxy = await getProxy(senderAcc.address);
            dataProvider = await getTravaDataProvider();
        });

        for (let i = 0; i < testLength; ++i) {
            const tokenSymbol = travaV2assetsDefaultMarket[i];
            const fetchedAmountWithUSD = fetchAmountinUSDPrice(tokenSymbol, '5000');
            it(`... should payback variable borrow ${fetchedAmountWithUSD} ${tokenSymbol} from Trava`, async () => {
                const snapshot = await takeSnapshot();
                const assetInfo = getAssetInfo(tokenSymbol);

                if (assetInfo.symbol === 'ETH') {
                    assetInfo.address = WETH_ADDRESS;
                }

                const reserveInfo = await getTravaReserveInfo(dataProvider, assetInfo.address);
                const aTokenInfo = await getTravaTokenInfo(dataProvider, assetInfo.address);
                const reserveData = await getTravaReserveData(dataProvider, assetInfo.address);

                if (!reserveInfo.borrowingEnabled) {
                    // eslint-disable-next-line no-unused-expressions
                    expect(true).to.be.true;
                    return;
                }

                const amount = hre.ethers.utils.parseUnits(
                    fetchedAmountWithUSD,
                    assetInfo.decimals,
                );

                if (reserveData.availableLiquidity.lt(amount)) {
                    // eslint-disable-next-line no-unused-expressions
                    expect(true).to.be.true;
                    return;
                }

                await supplyTrava(
                    proxy,
                    TRAVA_MARKET,
                    hre.ethers.utils.parseUnits(fetchAmountinUSDPrice('WETH', '20000'), 18),
                    WETH_ADDRESS,
                    senderAcc.address,
                );

                await borrowTrava(
                    proxy,
                    TRAVA_MARKET,
                    assetInfo.address,
                    amount,
                    VARIABLE_RATE,
                    senderAcc.address,
                );

                const debtBalanceBefore = await balanceOf(
                    aTokenInfo.variableDebtTokenAddress,
                    proxy.address,
                );

                await paybackTrava(
                    proxy,
                    TRAVA_MARKET,
                    assetInfo.address,
                    amount,
                    VARIABLE_RATE,
                    senderAcc.address,
                );

                const debtBalanceAfter = await balanceOf(
                    aTokenInfo.variableDebtTokenAddress,
                    proxy.address,
                );

                expect(debtBalanceAfter).to.be.lt(debtBalanceBefore);
                await revertToSnapshot(snapshot);
            });

            it(`... should payback stable borrow ${fetchedAmountWithUSD} ${tokenSymbol} from Trava`, async () => {
                const snapshot = await takeSnapshot();

                const assetInfo = getAssetInfo(tokenSymbol);

                if (assetInfo.symbol === 'ETH') {
                    // can't currently stable borrow if position already has eth
                    // eslint-disable-next-line no-unused-expressions
                    expect(true).to.be.true;
                    return;
                    // assetInfo.address = WETH_ADDRESS;
                }

                const reserveInfo = await getTravaReserveInfo(dataProvider, assetInfo.address);
                const aTokenInfo = await getTravaTokenInfo(dataProvider, assetInfo.address);
                const reserveData = await getTravaReserveData(dataProvider, assetInfo.address);

                if (!reserveInfo.stableBorrowRateEnabled) {
                    // eslint-disable-next-line no-unused-expressions
                    expect(true).to.be.true;
                    return;
                }

                const amount = hre.ethers.utils.parseUnits(
                    fetchedAmountWithUSD,
                    assetInfo.decimals,
                );

                if (reserveData.availableLiquidity.lt(amount)) {
                    // eslint-disable-next-line no-unused-expressions
                    expect(true).to.be.true;
                    return;
                }

                await supplyTrava(
                    proxy,
                    TRAVA_MARKET,
                    hre.ethers.utils.parseUnits(fetchAmountinUSDPrice('WETH', '20000'), 18),
                    WETH_ADDRESS,
                    senderAcc.address,
                );

                await borrowTrava(
                    proxy,
                    TRAVA_MARKET,
                    assetInfo.address,
                    amount,
                    STABLE_RATE,
                    senderAcc.address,
                );

                const debtBalanceBefore = await balanceOf(
                    aTokenInfo.stableDebtTokenAddress,
                    proxy.address,
                );

                await paybackTrava(
                    proxy,
                    TRAVA_MARKET,
                    assetInfo.address,
                    amount,
                    STABLE_RATE,
                    senderAcc.address,
                );

                const debtBalanceAfter = await balanceOf(
                    aTokenInfo.stableDebtTokenAddress,
                    proxy.address,
                );

                expect(debtBalanceAfter).to.be.lt(debtBalanceBefore);
                await revertToSnapshot(snapshot);
            });
        }
    });
};

const travaClaimStkTravaTest = async () => {
    describe('Trava-claim staked trava test', function () {
        this.timeout(150000);

        const stkTravaAddr = '0x4da27a545c0c5B758a6BA100e3a049001de870f5';

        const tokenSymbol = 'WETH';
        const assetInfo = getAssetInfo(tokenSymbol);
        const supplyAmount = fetchAmountinUSDPrice(tokenSymbol, '10000');

        let senderAcc; let proxy; let proxyAddr; let dataProvider;
        let aTokenInfo; let TravaView;
        let accruedRewards;
        let snapshot;

        before(async () => {
            const travaViewAddr = await getAddrFromRegistry('TravaView');
            TravaView = await hre.ethers.getContractAt('TravaView', travaViewAddr);
            senderAcc = (await hre.ethers.getSigners())[0];
            proxy = await getProxy(senderAcc.address);
            proxyAddr = proxy.address;
            dataProvider = await getTravaDataProvider();
            aTokenInfo = await getTravaTokenInfo(dataProvider, assetInfo.address);
            snapshot = await takeSnapshot();
        });

        it(`... should supply ${supplyAmount} ${tokenSymbol} to Trava`, async () => {
            const aTokenBalanceBefore = await balanceOf(aTokenInfo.aTokenAddress, proxyAddr);
            // eslint-disable-next-line max-len
            await supplyTrava(proxy, TRAVA_MARKET, hre.ethers.utils.parseUnits(supplyAmount, 18), WETH_ADDRESS, senderAcc.address);
            const aTokenBalanceAfter = await balanceOf(aTokenInfo.aTokenAddress, proxyAddr);

            // eslint-disable-next-line max-len
            expect(aTokenBalanceAfter.sub(aTokenBalanceBefore)).to.eq(hre.ethers.utils.parseUnits(supplyAmount, 18));
        });

        it('... should accrue rewards over time', async () => {
            const secondsInMonth = 2592000;
            await timeTravel(secondsInMonth);

            // eslint-disable-next-line max-len
            await supplyTrava(proxy, TRAVA_MARKET, hre.ethers.constants.One, WETH_ADDRESS, senderAcc.address);
            // this is done so the getter function below returns accurate balance

            accruedRewards = await TravaView['getUserUnclaimedRewards(address)'](proxyAddr);
            expect(accruedRewards).to.be.gt(hre.ethers.constants.Zero);
        });

        it('... should not revert when claiming 0 rewards', async () => {
        // eslint-disable-next-line max-len
            await expect(claimStkTrava(proxy, [aTokenInfo.aTokenAddress], hre.ethers.constants.Zero, proxyAddr)).to.not.be.reverted;
        });

        it('... should claim half of all accrued rewards', async () => {
        // eslint-disable-next-line max-len
            const stkTravaBalanceBefore = await balanceOf(stkTravaAddr, proxyAddr);
            await claimStkTrava(proxy, [aTokenInfo.aTokenAddress], accruedRewards.div('2'), proxyAddr);
            const stkTravaBalanceAfter = await balanceOf(stkTravaAddr, proxyAddr);
            expect(stkTravaBalanceAfter.sub(stkTravaBalanceBefore)).to.be.eq(accruedRewards.div('2'));
        });

        it('... should claim all accrued rewards when amount > unclaimed rewards', async () => {
        // eslint-disable-next-line max-len
            await claimStkTrava(proxy, [aTokenInfo.aTokenAddress], accruedRewards.add('1'), proxyAddr);
            const stkTravaBalanceAfter = await balanceOf(stkTravaAddr, proxyAddr);
            expect(stkTravaBalanceAfter / 1e18).to.be.closeTo(accruedRewards / 1e18, 0.00001);
            await revertToSnapshot(snapshot);
        });
    });
};

const travaDeployContracts = async () => {
    await redeploy('TravaWithdraw');
    await redeploy('TravaBorrow');
    await redeploy('TravaSupply');
    await redeploy('TravaPayback');
    await redeploy('TravaClaimStkTrava');
    await redeploy('TravaView');
};

const travaFullTest = async (testLength) => {
    await travaDeployContracts();

    await travaSupplyTest(testLength);

    await travaBorrowTest(testLength);

    await travaWithdrawTest(testLength);

    await travaPaybackTest(testLength);

    await travaClaimStkTravaTest();
};

module.exports = {
    travaBorrowTest,
    travaSupplyTest,
    travaWithdrawTest,
    travaPaybackTest,
    travaClaimStkTravaTest,
    travaFullTest,
    travaDeployContracts,
};
