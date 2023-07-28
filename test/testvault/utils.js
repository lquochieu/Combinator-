const hre = require('hardhat');
const { keccak256 } = require('web3-utils');
const abiCoder = new hre.ethers.utils.AbiCoder();
const { Action } = require('./Action');

const nullAddress = '0x0000000000000000000000000000000000000000';

const getProxy = async (acc) => {
  const proxyRegistry = (await hre.ethers.getContractAt('IProxyRegistry', process.env.DS_PROXY_REGISTRY_ADDRESS));
  let proxyAddr = await proxyRegistry.proxies(acc);

  if (proxyAddr === nullAddress) {
    await proxyRegistry.build(acc);
    proxyAddr = await proxyRegistry.proxies(acc);
    console.log("ProxyAddr:: 1", proxyAddr);
  }

  const dsProxy = await hre.ethers.getContractAt('IDSProxy', proxyAddr);
  return await dsProxy;
};

const getNameId = (name) => {
  const hash = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes(name));
  return hash.substr(0, 10);
};

const getAddrFromRegistry = async (name, regAddr = process.env.DFS_REGISTRY_ADDRESS) => {
  const registryInstance = await hre.ethers.getContractFactory("DFSRegistry");
  const registry = registryInstance.attach(regAddr);

  const addr = await registry.getAddr(
    getNameId(name),
  );
  return addr;
};

const approve = async (tokenAddr, to, signer) => {
  const tokenContract = await hre.ethers.getContractAt('ERC20Mock', tokenAddr);

  const from = signer ? signer.address : tokenContract.signer.address;

  const allowance = await tokenContract.allowance(from, to);
  console.log("allowance::", allowance.toString());

  if (allowance.toString() === '0') {
    if (signer) {
      const tokenContractSigner = tokenContract.connect(signer);
      await tokenContractSigner.approve(to, hre.ethers.constants.MaxUint256, { gasLimit: 1000000 });
      const allowance = await tokenContract.allowance(from, to);
      console.log("allowance::", allowance);
    } else {
      await tokenContract.approve(to, hre.ethers.constants.MaxUint256, { gasLimit: 1000000 });
      const allowance = await tokenContract.allowance(from, to);
      console.log("allowance::", allowance);
    }
  }
};

const approveNFT = async (to, _tokenId, signer) => {
  const nftContract = await hre.ethers.getContractAt('INFTCollection', "0x1B9356df6b10Ed01752F6361C8c0a982C99b8cA4");
  const from = signer ? signer.address : nftContract.signer.address;

  const isApproved = await nftContract.getApproved(_tokenId);
  const isApprovedForAll = await nftContract.getApproved(from, to);
  console.log("isApproved::", isApproved);
  console.log("isApprovedForAll::", isApprovedForAll);
}

const testvault = async(owner, proxy) => {
  await approveNFT(proxy, 49);
  // const wbnb = (await hre.ethers.getContractFactory("ERC20Mock")).attach(process.env.TOKEN_B_TEST);
  // const trava = (await hre.ethers.getContractFactory("ERC20Mock")).attach(process.env.TRAVA_TOKEN_ADDRESS);
  // console.log("Before:: Balance wbnb of Owner::", await wbnb.balanceOf(owner.address));
  // console.log("Before:: Balance trava of Owner::", await trava.balanceOf(owner.address));

  // console.log("Before:: Balance wbnb of proxy::", await wbnb.balanceOf(owner.address));
  // console.log("Before:: Balance trava of proxy::", await trava.balanceOf(owner.address));

  // let actionsCallData = [];
  // let subData = [];
  // let actionIds = [];

  // // Để swap được phải approve từ trước, appove cả NFT
  // await approve(process.env.TOKEN_B_TEST, proxy.address);
  // await approve(process.env.TRAVA_TOKEN_IN_MARKET, proxy.address);
  // await approveForAllNFT(process.env.TRAVA_NFT_CORE, proxy.address);

  // // Wrap bnb sang wbnb
  // const wrapBNBAction = new Action(
  //   "WrapBnb", 
  //   process.env.WRAP_BNB_ADDRESS, 
  //   ['uint256'], 
  //   ["10000000000000000"]
  // )
  // // swap wbnb sang trava, trava nhận được sẽ gửi vào tk owner luôn
  // const swapAction = new Action(
  //   "PancakeSwapV2",
  //   process.env.PANCAKE_SWAP_V2_ADDRESS,
  //   ["uint256", "uint256", "address[]", "address", "uint256", "address"],
  //   ["10000000000000000", "0", [process.env.TOKEN_B_TEST, process.env.TRAVA_TOKEN_IN_MARKET], proxy.address, "2688452425", owner.address]
  // );
  // // Buy nft
  // const buyNFTAction = new Action(
  //   "TravaNFTBuy",
  //   process.env.TRAVA_NFT_BUY_ADDRESS,
  //   ["uint256", "address"],
  //   ["4210", owner.address] //***** Thế id của nft cần dùng vào 
  // );
  // // Transfer cho accA
  // const transferNFTAction = new Action(
  //   "TravaNFTTransfer",
  //   process.env.TRAVA_NFT_TRANSFER_ADDRESS,
  //   ["address", "address", "uint256"],
  //   [owner.address, accA.address, "0"]
  // );

  // const callDataWrapBNB = wrapBNBAction.encodeForRecipe()[0];
  // const callDataSwap = swapAction.encodeForRecipe()[0];
  // const callDataBuyNFT = buyNFTAction.encodeForRecipe()[0];
  // const callDataTransferNFT = transferNFTAction.encodeForRecipe()[0];
  // actionsCallData.push(callDataWrapBNB);
  // actionsCallData.push(callDataSwap);
  // actionsCallData.push(callDataBuyNFT);
  // actionsCallData.push(callDataTransferNFT);
  
  // let paramMapping = [
  //   [0],
  //   [0, 0, 0, 0, 0, 0, 0], // Chú ý mảng address cũng phải truyền parammapping theo thứ tự từng phần tử
  //   [0, 0],
  //   [0, 0, 3]
  // ];
  // actionIds = [
  //   keccak256("WrapBnb").substr(0, 10),
  //   keccak256("PancakeSwapV2").substr(0, 10),
  //   keccak256("TravaNFTBuy").substr(0, 10),
  //   keccak256("TravaNFTTransfer").substr(0, 10)
  // ];

  // const RecipeExecutorContract = await hre.ethers.getContractAt(
  //   "RecipeExecutor",
  //   process.env.RECIPE_EXECUTOR_ADDRESS
  // );

  // const calldata = RecipeExecutorContract.interface.encodeFunctionData(
  //   "executeRecipe",
  //   [
  //     {
  //       name: "PancakeSwapTrava",
  //       callData: actionsCallData,
  //       subData: subData,
  //       actionIds: actionIds,
  //       paramMapping: paramMapping,
  //     },
  //   ]
  // );

  // let tx = await proxy["execute(address,bytes)"](
  //   RecipeExecutorContract.address,
  //   calldata,
  //   {
  //     gasLimit: 20000000,
  //     value: "10000000000000000"
  //   }
  // );

  // tx = await tx.wait();
  // console.log("txHash", tx.transactionHash);
  // console.log("After:: Balance wbnb of Owner::", await wbnb.balanceOf(owner.address));
  // console.log("After:: Balance trava of Owner::", await trava.balanceOf(owner.address));
}

module.exports = {
  getProxy,
  testvault
}