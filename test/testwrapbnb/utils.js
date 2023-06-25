const hre = require('hardhat');
const { keccak256 } = require('web3-utils');
const abiCoder = new hre.ethers.utils.AbiCoder();
const { Action } = require('./Action');

const nullAddress = '0x0000000000000000000000000000000000000000';

const getProxy = async (acc, userAcc) => {
  // Lấy address DSProxy của user
  const proxyRegistry = (await hre.ethers.getContractAt('IProxyRegistry', process.env.DS_PROXY_REGISTRY_ADDRESS));
  let proxyAddr = await proxyRegistry.proxies(acc);

  // Nếu k tồn tại thì thực hiện tạo mới luôn
  if (proxyAddr === nullAddress) {
    await proxyRegistry.build(acc);
    proxyAddr = await proxyRegistry.proxies(acc);
    console.log("ProxyAddr:: 1", proxyAddr);
  }    

  // Lấy instance contract DSProxy 
  const dsProxy = await hre.ethers.getContractAt('IDSProxy', proxyAddr);
  
  return await dsProxy.connect(userAcc);
};

async function setupPermission(botAcc) {
  const botAuth = await (await hre.ethers.getContractFactory("BotAuth")).attach(process.env.BOT_AUTH_ADDRESS);
  if(await botAuth.isApproved(0, botAcc.address) == false)
    await botAuth.addCaller(botAcc.address);
  console.log("Approve bot auth::", await botAuth.isApproved(0, botAcc.address));
}

function createXStrategy() {
  return [
    "XStrategy",
    [keccak256("BNBBalanceTrigger").substr(0, 10)],
    [keccak256("WrapBnb").substr(0, 10), keccak256("SendToken").substr(0, 10), keccak256("UnwrapBnb").substr(0, 10)],
    [
      [
        128
      ],
      [
        129,
        130,
        131
      ],
      [
        132,
        133
      ]
    ]
  ];
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

const createStrategy = async (strategyName, triggerIds, actionIds, paramMapping, continuous) => {
  const storageAddr = await getAddrFromRegistry('StrategyStorage');
  const storage = await hre.ethers.getContractAt('StrategyStorage', storageAddr);
  const receipt = await storage.createStrategy(
    strategyName, triggerIds, actionIds, paramMapping, continuous
  );
  await receipt.wait();

  const strategyId = await getLatestStrategyId();

  console.log('StrategyId: ', strategyId);

  return strategyId;
};

const getLatestStrategyId = async () => {
  const strategyStorageAddr = await getAddrFromRegistry('StrategyStorage');

  const strategyStorageInstance = await hre.ethers.getContractFactory('StrategyStorage');
  const strategyStorage = await strategyStorageInstance.attach(strategyStorageAddr);

  let latestStrategyId = await strategyStorage.getStrategyCount();
  latestStrategyId = (latestStrategyId - 1).toString();

  return latestStrategyId;
};

const createBNBBalanceTrigger = async (address, value) => {
  const param = abiCoder.encode(["address", 'uint256'], [address, value]);
  return param;
};

const subTestStrategy = async (proxy, value, receiverAddress, strategyId, ownerAddress) => {
  const isBundle = false;

  const valueToSend = value.div(2).toString();
  const valueToUnwrap = value.sub(value.div(2)).toString();
  const triggerData = await createBNBBalanceTrigger(ownerAddress, value);
  const wrapBNB1Encoded = abiCoder.encode(['uint256'], [value.toString()]);
  const sendToken1Encoded = abiCoder.encode(['address'], [process.env.WBNB_BSCTESTNET]);
  const sendToken2Encoded = abiCoder.encode(['address'], [receiverAddress]);
  const sendToken3Encoded = abiCoder.encode(['uint256'], [valueToSend]);
  const unwrapBNB1Encoded = abiCoder.encode(['uint256'], [valueToUnwrap]);
  const unwrapBNB12ncoded = abiCoder.encode(['address'], [ownerAddress]);

  const strategySub = [strategyId, isBundle, [triggerData], [wrapBNB1Encoded, sendToken1Encoded, sendToken2Encoded, sendToken3Encoded, unwrapBNB1Encoded, unwrapBNB12ncoded]];

  const subId = await subToStrategy(proxy, strategySub);

  return { subId, strategySub };
};

const subToStrategy = async (proxy, strategySub, regAddr = process.env.DFS_REGISTRY_ADDRESS) => {
  const SubProxyAddr = process.env.SUB_PROXY_ADDRESS;

  const SubProxyProxy = await hre.ethers.getContractFactory('SubProxy');
  const functionData = SubProxyProxy.interface.encodeFunctionData(
    'subscribeToStrategy',
    [strategySub],
  );

  const receipt = await proxy['execute(address,bytes)'](SubProxyAddr, functionData, {
    gasLimit: 1e7,
  });
  await receipt.wait();

  const latestSubId = await getLatestSubId(regAddr);
  console.log("latestSubId::", latestSubId);

  return latestSubId;
};

const getLatestSubId = async (regAddr) => {
  const subStorageAddr = await getAddrFromRegistry('SubStorage', regAddr);
  console.log("subStorageAddr::", subStorageAddr);

  const subStorageInstance = await hre.ethers.getContractFactory('SubStorage');
  const subStorage = await subStorageInstance.attach(subStorageAddr);

  let latestSubId = await subStorage.getSubsCount();
  latestSubId = (latestSubId - 1).toString();

  return latestSubId;
};

const getStrategySub = async (value, ownerAddress, receiverAddress, strategyId) => {
  const isBundle = false;

  const valueToSend = value.div(2).toString();
  const valueToUnwrap = value.sub(value.div(2)).toString();
  const triggerData = await createBNBBalanceTrigger(ownerAddress, value);
  const wrapBNB1Encoded = abiCoder.encode(['uint256'], [value.toString()]);
  const sendToken1Encoded = abiCoder.encode(['address'], [process.env.WBNB_BSCTESTNET]);
  const sendToken2Encoded = abiCoder.encode(['address'], [receiverAddress]);
  const sendToken3Encoded = abiCoder.encode(['uint256'], [valueToSend]);
  const unwrapBNB1Encoded = abiCoder.encode(['uint256'], [valueToUnwrap]);
  const unwrapBNB12ncoded = abiCoder.encode(['address'], [ownerAddress]);

  const strategySub = [strategyId, isBundle, [triggerData], [wrapBNB1Encoded, sendToken1Encoded, sendToken2Encoded, sendToken3Encoded, unwrapBNB1Encoded, unwrapBNB12ncoded]];
  return strategySub;
}

const callStrategy = async (addressProxy, botAcc, subId, val, receiverAddress, ownerAcc, strategyId) => {
  const triggerCallData = [];
  const actionsCallData = [];

  triggerCallData.push(abiCoder.encode(["address", 'uint256'], [ownerAcc.address, val]));

  const valueToSend = val.div(2).toString();
  const valueToUnwrap = val.sub(val.div(2)).toString();
  
  const wrapBNBAction = new Action("WrapBnb", process.env.WRAP_BNB_ADDRESS, ['uint256'], [val.toString()]);
  const sendTokenAction = new Action("SendToken", process.env.SEND_TOKEN_ADDRESS, ["address", "address", "uint256"], [process.env.WBNB_BSCTESTNET, receiverAddress, valueToSend]);
  const unwrapBNBAction = new Action("UnwrapBnb", process.env.UNWRAP_BNB_ADDRESS, ["uint256", "address"], [valueToUnwrap, ownerAcc.address]);
  
  actionsCallData.push(wrapBNBAction.encodeForRecipe()[0]);
  actionsCallData.push(sendTokenAction.encodeForRecipe()[0]);
  actionsCallData.push(unwrapBNBAction.encodeForRecipe()[0]);

  const strategyExecutorByBot = await (await hre.ethers.getContractFactory("StrategyExecutor")).attach(process.env.STRATEGY_EXECUTOR_ADDRESS).connect(botAcc);
  const strategyIndex = 0; 

  console.log("YYY");
  const receipt = await strategyExecutorByBot.executeStrategy(subId, strategyIndex, triggerCallData, actionsCallData, await getStrategySub(val, ownerAcc.address, receiverAddress, strategyId));
  const parsed = await receipt.wait();

  // console.log(parsed.gasUsed.toString());
  // console.log(parsed);
  // console.log("ZZZ");

  console.log("After calling strategy::");
  const wbnbContract = (await hre.ethers.getContractAt('IWBNB', process.env.WBNB_BSCTESTNET));
  console.log("Balance of receiver:: ", await wbnbContract.balanceOf(receiverAddress));
};

module.exports = {
  getProxy,
  setupPermission,
  createXStrategy,
  createStrategy,
  getAddrFromRegistry,
  subTestStrategy,
  callStrategy
}