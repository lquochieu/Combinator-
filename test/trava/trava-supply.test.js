const hre = require('hardhat');
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require('../teststrategy/Action');

describe('Trava-Supply', function () {
    this.timeout(150000);

    it("Test trava supply", async() => {
        
        const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330"
        const tokenAddress = process.env.WBNB_BSCTESTNET
        const amount = 1e12
        const from = process.env.PUBLIC_KEY
        const onBehalf = process.env.DS_PROXY
        const enableAsColl = false
        
        console.log("prepare supply")
       
        const traveSupply = new Action("TravaSupply", process.env.TRAVA_SUPPLY, ['address', 'address', 'uint256', 'address', 'address', 'bool'], [market, tokenAddress, amount, from, onBehalf, enableAsColl])
        
        const calldata = traveSupply.encodeForRecipe()[0]
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

        const parramMapping = traveSupply.encodeForRecipe()[3]
        //console.log("parramMapping", parramMapping)

        const returnValues = "0x0000000000000000000000000000000000000000000000000000000000000000"
        //console.log("returnValues", returnValues)

        const supplyInput = {
            calldata: calldata,
            subdata: subdata,
            parramMapping: [parramMapping],
            returnValues: returnValues
        }

        console.log(supplyInput)
        // const supplyContract = await hre.ethers.getContractAt("TravaSupply", process.env.TRAVA_SUPPLY)
        // console.log("start Supply")
        // // const travaSupply = await supplyContract.executeAction(calldata, subdata, [parramMapping], [returnValues]);
        // const travaSupply = await supplyContract.executeActionDirect(calldata);

//        console.log("ok")
    })
});
