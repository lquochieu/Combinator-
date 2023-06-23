const hre = require('hardhat');
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const { Action } = require('../teststrategy/Action');

describe('Trava-Borrow', function () {
    this.timeout(150000);

    it("Test trava borrow", async() => {
        
        const market = "0x6df52f798740504c24ccd374cf7ce81b28ce8330"
        const tokenAddress = process.env.WBNB_BSCTESTNET
        const amount = 1e12
        const to = process.env.PUBLIC_KEY
        const onBehalf = process.env.DS_PROXY
        
        console.log("prepare borrow")
       
        const traveBorrow = new Action("TravaBorrow", process.env.TRAVA_BORROW, ['address', 'address', 'uint256', 'address', 'address'], [market, tokenAddress, amount, to, onBehalf])
        
        const calldata = traveBorrow.encodeForRecipe()[0]
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

        const parramMapping = traveBorrow.encodeForRecipe()[3]
        //console.log("parramMapping", parramMapping)

        const returnValues = "0x0000000000000000000000000000000000000000000000000000000000000000"
        //console.log("returnValues", returnValues)

        const borrowInput = {
            calldata: calldata,
            subdata: subdata,
            parramMapping: [parramMapping],
            returnValues: returnValues
        }

        console.log(borrowInput)
        // const borrowContract = await hre.ethers.getContractAt("TravaBorrow", process.env.TRAVA_SUPPLY)
        // console.log("start Borrow")
        // // const travaBorrow = await borrowContract.executeAction(calldata, subdata, [parramMapping], [returnValues]);
        // const travaBorrow = await borrowContract.executeActionDirect(calldata);

//        console.log("ok")
    })
});
