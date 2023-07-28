const { ethers } = require("hardhat");
require("dotenv").config();
const { Action } = require("../../teststrategy/Action");
const { getProxy } = require("../../utils");
const { keccak256 } = require("web3-utils");
const { approveForAllNFT } = require("./utils");

const abiCoder = new hre.ethers.utils.AbiCoder();

describe("Test trava auction", function () {
  this.timeout("1500000000000");
  it("Test trava create auction", async () => {
    const tokenId = 84;
    const startingBid = hre.ethers.utils.parseEther("25000");
    const duration = 172800;
    const from = process.env.PUBLIC_KEY;
    const proxy = await getProxy(process.env.PUBLIC_KEY);
    const ceilingPrice = 0;
    const method = 0;
    console.log(tokenId, startingBid, duration, from, proxy.address);

    console.log("prepare create auction");

    //Approve all NFT to proxy first
    //await approveForAllNFT("0x5D996eC57756cEB127a4eD3302d7F28F52FDEbb1",proxy.address);

    //createAuction ceilingPrice và method để 0 ,startingBid at least 1000, duration at least 1 day
    const travaCreateAuction = new Action(
      "TravaNFTAuctionCreateAuction",
      process.env.TRAVA_NFT_AUCTION_CREATE_AUCTION_ADDRESS,
      ["uint256", "uint256", "uint256", "uint256", "uint256", "address"],
      [tokenId, startingBid, duration, ceilingPrice, method, from]
    );

    const calldata = travaCreateAuction.encodeForDsProxyCall()[1];
    console.log("calldata", calldata);

    const travaCreateAuctionContract = await hre.ethers.getContractAt(
      "TravaNFTAuctionCreateAuction",
      process.env.TRAVA_NFT_AUCTION_CREATE_AUCTION_ADDRESS
    );
    console.log(process.env.TRAVA_NFT_AUCTION_CREATE_AUCTION_ADDRESS);

    let tx = await proxy["execute(address,bytes)"](
      travaCreateAuctionContract.address,
      calldata,
      {
        gasPrice: 1000000000,
        gasLimit: 20000000,
      }
    );

    tx = await tx.wait();
    console.log("tx", tx);
    //console.log("tx", tx);
  });
});
