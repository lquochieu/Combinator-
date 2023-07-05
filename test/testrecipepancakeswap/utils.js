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

const addLiquidity = async (owner, proxy, token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from) => {
  await approve(token0, proxy.address);
  await approve(token1, proxy.address);

  console.log("Run to addLiquidity");
  const addLiquidityAction = new Action(
    "PancakeAddLiquidityV3",
    process.env.PANCAKE_ADD_LIQUIDITY_V3_ADDRESS,
    ["address", "address", "uint24", "int24", "int24", "uint256", "uint256", "uint256", "uint256", "address", "uint256", "address"],
    [token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from]
  );
  // console.log(token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from);
  const functionData = addLiquidityAction.encodeForDsProxyCall()[1];
  // console.log(functionData);

  const createPoolContract = await getAddrFromRegistry("PancakeAddLiquidityV3");
  // console.log(createPoolContract);

  const position = await hre.ethers.getContractAt("INonfungiblePositionManager",process.env.NON_FUNGIBLE_POSITION_MANAGER);
  const length = await position.balanceOf(owner.address);
  console.log("Before, balance of user::", length);
  for(var i = 0; i < length; i++){
    console.log("::", await position.tokenOfOwnerByIndex(owner.address, i));
  }

  let tx = await proxy["execute(address,bytes)"](
    createPoolContract,
    functionData
  );
  tx = await tx.wait();
  console.log("tx hash::", tx.transactionHash);

  const length2 = await position.balanceOf(owner.address);
  console.log("After, balance of user::", length2);
  console.log("Last index tokenid is::", await position.tokenOfOwnerByIndex(owner.address, length2 - 1));
}

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
  console.log("allowance::", allowance);

  if (allowance.toString() === '0') {
    if (signer) {
      const tokenContractSigner = tokenContract.connect(signer);
      await tokenContractSigner.approve(to, hre.ethers.constants.MaxUint256, { gasLimit: 1000000 });
    } else {
      await tokenContract.approve(to, hre.ethers.constants.MaxUint256, { gasLimit: 1000000 });
    }
  }
};

const increaseLiquidity = async (proxy, token0, token1, tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline, from) => {
  console.log("Run to increaseLiquidity");
  await approve(token0, proxy.address);
  await approve(token1, proxy.address);
  const increaseLiquidityAction = new Action(
    "PancakeIncreaseLiquidityV3",
    process.env.PANCAKE_INCREASE_LIQUIDITY_V3_ADDRESS,
    ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256", "address"],
    [tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline, from]
  );
  const functionData = increaseLiquidityAction.encodeForDsProxyCall()[1];

  const createPoolContract = await getAddrFromRegistry("PancakeIncreaseLiquidityV3");
  console.log(createPoolContract);

  const position = await hre.ethers.getContractAt("INonfungiblePositionManager",process.env.NON_FUNGIBLE_POSITION_MANAGER);
  console.log("Before, tokenPosition::", (await position.positions(tokenId)).liquidity);

  let tx = await proxy["execute(address,bytes)"](
    createPoolContract,
    functionData
  );
  tx = await tx.wait();
  console.log("tx hash::", tx.transactionHash);

  console.log("After, tokenPosition::", (await position.positions(tokenId)).liquidity);
}

const createPool = async (owner, proxy, token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from, sqrtPriceX96) => {
  console.log("Run to createPool");
  await approve(token0, proxy.address);
  await approve(token1, proxy.address);

  await approve(token0, "0x427bF5b37357632377eCbEC9de3626C71A5396c1");
  await approve(token1, "0x427bF5b37357632377eCbEC9de3626C71A5396c1");
  const createPoolAction = new Action(
    "PancakeCreatePoolV3",
    process.env.PANCAKE_CREATE_POOL_V3_ADDRESS,
    ["address", "address", "uint24", "int24", "int24", "uint256", "uint256", "uint256", "uint256", "address", "uint256", "address", "uint160"],
    [token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from, sqrtPriceX96]
  );
  console.log(token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from, sqrtPriceX96);
  const functionData = createPoolAction.encodeForDsProxyCall()[1];

  const createPoolContract = await getAddrFromRegistry("PancakeCreatePoolV3");
  console.log(createPoolContract);

  const position = await hre.ethers.getContractAt("INonfungiblePositionManager",process.env.NON_FUNGIBLE_POSITION_MANAGER);
  const length = await position.balanceOf(owner.address);
  console.log("Before, balance of user::", length);
  // for(var i = 0; i < length; i++){
  //   console.log("::", await position.tokenOfOwnerByIndex(owner.address, i));
  // }

  let tx = await proxy["execute(address,bytes)"](
    createPoolContract,
    functionData
  );
  tx = await tx.wait();
  console.log("tx hash::", tx.transactionHash);

  const length2 = await position.balanceOf(owner.address);
  console.log("After, balance of user::", length2);
  // console.log("Last index is::", await position.tokenOfOwnerByIndex(owner.address, length2 - 1));
}

module.exports = {
  getProxy,
  addLiquidity,
  increaseLiquidity,
  createPool
}