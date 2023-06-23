const hre = require('hardhat');
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require('../teststrategy/Action');

describe('Trava-Repay', function () {
    this.timeout(150000);

    it("Test trava repay", async() => {
        
        const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330"
        const tokenAddress = process.env.WBNB_BSCTESTNET
        const amount = 1e12
        const from = process.env.PUCLIC_KEY
        const onBehalf = process.env.DS_PROXY
        
        console.log("prepare repay")
       
        const traveRepay = new Action("TravaRepay", process.env.TRAVA_REPAY, ['address', 'address', 'uint256', 'address', 'address'], [market, tokenAddress, amount, from, onBehalf, enableAsColl])
        
        const calldata = traveRepay.encodeForRecipe()[0]
        //console.log("calldata", calldata)

        const subdata = [
            abiCoder.encode(['address'], [market]),
            abiCoder.encode(['address'], [tokenAddress.toString()]),
            abiCoder.encode(['uint256'], [amount.toString()]),
            abiCoder.encode(['address'], [from.toString()]),
            abiCoder.encode(['address'], [onBehalf.toString()]),
            abiCoder.encode(['bool'], [enableAsColl])
        ]
        //console.log("subdata", subdata)

        const parramMapping = traveRepay.encodeForRecipe()[3]
        //console.log("parramMapping", parramMapping)

        const returnValues = "0x0000000000000000000000000000000000000000000000000000000000000000"
        //console.log("returnValues", returnValues)

        const repayInput = {
            calldata: calldata,
            subdata: subdata,
            parramMapping: [parramMapping],
            returnValues: returnValues
        }

        console.log(repayInput)
        // const repayContract = await hre.ethers.getContractAt("TravaRepay", process.env.TRAVA_SUPPLY)
        // console.log("start Repay")
        // // const travaRepay = await repayContract.executeAction(calldata, subdata, [parramMapping], [returnValues]);
        // const travaRepay = await repayContract.executeActionDirect(calldata);

//        console.log("ok")
    })
});
