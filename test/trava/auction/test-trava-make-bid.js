const { ethers } = require("hardhat");
require("dotenv").config();
const { Action } = require("../../teststrategy/Action");
const { getProxy, approve } = require("../../utils");
const { keccak256 } = require("web3-utils");

const abiCoder = new hre.ethers.utils.AbiCoder();

describe("Test trava make bid", function () {
  this.timeout("1500000000000");
  it("Test trava make bid", async () => {
    const tokenId = 84;
    const bidPrice = hre.ethers.utils.parseEther("20000");
    //const from = process.env.PUBLIC_KEY;
    //const proxy = await getProxy(process.env.PUBLIC_KEY);
    let accA = (await hre.ethers.getSigners())[1];
    let proxyA = await getProxy(accA.address);

    //Approve cho proxy A toan bo token trava
    //await approve(process.env.TRAVA_TOKEN_IN_MARKET, proxyA, accA);
    console.log(
      process.env.TRAVA_TOKEN_IN_MARKET,
      proxyA.address,
      accA.address
    );

    const travaMakeBid = new Action(
      "TravaNFTAuctionMakeBid",
      process.env.TRAVA_NFT_AUCTION_MAKE_BID_ADDRESS,
      ["uint256", "uint256", "address"],
      [tokenId, bidPrice, accA.address]
    );
    console.log(process.env.TRAVA_NFT_AUCTION_MAKE_BID_ADDRESS);
    console.log(tokenId, bidPrice, accA.address);

    const calldata = travaMakeBid.encodeForDsProxyCall()[1];
    console.log("calldata", calldata);

    const travaMakeBidContract = await hre.ethers.getContractAt(
      "TravaNFTAuctionMakeBid",
      process.env.TRAVA_NFT_AUCTION_MAKE_BID_ADDRESS
    );
    const tx = await proxyA
      .connect(accA)
      .execute(travaMakeBidContract.address, calldata, {
        gasPrice: 20000000,
      });
    await tx.wait();
    console.log(travaMakeBidContract.address);
  });
});
