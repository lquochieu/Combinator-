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

const createPool = async (proxy, token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from) => {
  await approve(token0, proxy.address);
  await approve(token1, proxy.address);

  console.log("Run to create pool");
  const createPoolAction = new Action(
    "PancakeAddLiquidityV3",
    process.env.PANCAKE_ADD_LIQUIDITY_V3_ADDRESS,
    ["address", "address", "uint24", "int24", "int24", "uint256", "uint256", "uint256", "uint256", "address", "uint256", "address"],
    [token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from]
  );
  console.log(token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from);
  const functionData = createPoolAction.encodeForDsProxyCall()[1];
  console.log(functionData);

  const createPoolContract = await getAddrFromRegistry("PancakeAddLiquidityV3");
  console.log(createPoolContract);

  // let tx = await proxy["execute(address,bytes)"](
  //   createPoolContract,
  //   functionData,
  //   {
  //     gasLimit: 20000000,
  //   }
  // );

  // tx = await tx.wait();
  // console.log("tx::", tx);
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

module.exports = {
  getProxy,
  createPool
}