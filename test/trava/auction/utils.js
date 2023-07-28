const hre = require("hardhat");
const { keccak256 } = require("web3-utils");
const abiCoder = new hre.ethers.utils.AbiCoder();
const approveForAllNFT = async (tokenAddr, to, signer) => {
  const nftContract = await hre.ethers.getContractAt("IERC721", tokenAddr);
  const from = signer ? signer.address : nftContract.signer.address;
  console.log("From is", from, "To is", to);

  const allowance = await nftContract.isApprovedForAll(from, to);
  console.log("Approved For All::", allowance.toString());

  if (allowance.toString() != "true") {
    if (signer) {
      const nftContractSigner = nftContract.connect(signer);
      await nftContractSigner.setApprovalForAll(to, true, {
        gasPrice: 20000000,
      });

      const allowance = await nftContract.isApprovedForAll(from, to);
      console.log("Approved For All::", allowance.toString());
    } else {
      console.log(tokenAddr, to);
      console.log("vao day");
      const result = await nftContract.setApprovalForAll(to, true, {
        gasPrice: 20000000,
      });
      console.log("result:", result);

      const allowance = await nftContract.isApprovedForAll(from, to);
      console.log("Approved For All::", allowance.toString());
    }
  }
};
const approve = async (tokenAddr, to, signer) => {
  const tokenContract = await hre.ethers.getContractAt("IERC20Test", tokenAddr);

  const from = signer ? signer.address : tokenContract.signer.address;

  const allowance = await tokenContract.allowance(from, to);

  if (allowance.toString() === "0") {
    if (signer) {
      const tokenContractSigner = tokenContract.connect(signer);
      // eslint-disable-next-line max-len
      await tokenContractSigner.approve(to, hre.ethers.constants.MaxUint256, {
        gasPrice: 2000000,
      });
    } else {
      await tokenContract.approve(to, hre.ethers.constants.MaxUint256, {
        gasPrice: 2000000,
      });
    }
  }
};
module.exports = {
  approveForAllNFT,
  approve,
};
