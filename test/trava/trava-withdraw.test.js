const hre = require('hardhat');
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require('../teststrategy/Action');

describe('Trava-Withdraw', function () {
    this.timeout(150000);

    it("Test trava withdraw", async() => {
        
        const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330"
        const tokenAddress = process.env.WBNB_BSCTESTNET
        const amount = 1e10
        const to = process.env.PUBLIC_KEY
        
        console.log("prepare withdraw")
       
        const traveWithdrawAction = new Action("TravaWithdraw", process.env.TRAVA_WITHDRAW, ['address', 'address', 'uint256', 'address'], [market, tokenAddress, amount, to])
        
        const calldata = traveWithdrawAction.encodeForRecipe()[0]

        const subdata = [
            abiCoder.encode(['address'], [market]),
            abiCoder.encode(['address'], [tokenAddress.toString()]),
            abiCoder.encode(['uint256'], [amount.toString()]),
            abiCoder.encode(['address'], [to.toString()])
        ]

        const parramMapping = traveWithdrawAction.encodeForRecipe()[3]

        const returnValues = "0x0000000000000000000000000000000000000000000000000000000000000000"

        const withdrawInput = {
            calldata: calldata,
            subdata: subdata,
            parramMapping: [parramMapping],
            returnValues: returnValues
        }

        console.log(withdrawInput)
        // const withdrawContract = await hre.ethers.getContractAt("TravaWithdraw", process.env.TRAVA_WITHDRAW)
        // console.log("start withdraw")
        // const travaWithdraw = await withdrawContract.executeAction(calldata, subdata, [parramMapping], [returnValues]);
        // // const travaWithdraw = await withdrawContract.executeActionDirect(calldata);

        //console.log("ok")
    })
});
