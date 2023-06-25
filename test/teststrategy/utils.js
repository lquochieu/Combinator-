const hre = require('hardhat');
const ActionAbi = require('./Action.json');
const AbiCoder = require('web3-eth-abi');
const { Action } = require('./Action');
const { keccak256 } = require('web3-utils');
const abiCoder = new hre.ethers.utils.AbiCoder();
require("dotenv").config();

const nullAddress = '0x0000000000000000000000000000000000000000';

const addrs = {
  testnet: {
    ADMIN_VAULT: process.env.ADMIN_VAULT_ADDRESS,
    REGISTRY_ADDR: process.env.DFS_REGISTRY_ADDRESS,
    OWNER_ACC: process.env.PUBLIC_KEY,
    ADMIN_ACC: process.env.PUBLIC_KEY,
    PROXY_REGISTRY: process.env.DS_PROXY_REGISTRY_ADDRESS,
    SubProxy: process.env.SUB_PROXY_ADDRESS,
    StrategyProxy: process.env.STRATEGY_PROXY_ADDRESS,
    // WETH_ADDRESS: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    // DAI_ADDRESS: '0x6b175474e89094c44da98b954eedeac495271d0f',
    // ETH_ADDR: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    // TOKEN_GROUP_REGISTRY: '0xcA49e64FE1FE8be40ED30F682edA1b27a6c8611c',
    // FEE_RECEIVER: '0x6467e807dB1E71B9Ef04E0E3aFb962E4B0900B2B',
    // USDC_ADDR: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    // EXCHANGE_OWNER_ADDR: '0xBc841B0dE0b93205e912CFBBd1D0c160A1ec6F00',
    // SAVER_EXCHANGE_ADDR: '0x25dd3F51e0C3c3Ff164DDC02A8E4D65Bb9cBB12D',
    // UNISWAP_WRAPPER: '0x6cb48F0525997c2C1594c89e0Ca74716C99E3d54',
    // UNISWAP_V3_WRAPPER: '0xA250D449e8246B0be1ecF66E21bB98678448DEF5',
    // UNIV3_WRAPPER: '0xA250D449e8246B0be1ecF66E21bB98678448DEF5',
    // FEED_REGISTRY: '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf',
    // COMET_USDC_ADDR: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
    // COMET_USDC_REWARDS_ADDR: '0x1B0e765F6224C21223AeA2af16c1C46E38885a40',
    // COMP_ADDR: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    // CHICKEN_BONDS_VIEW: '0x809a93fd4a0d7d7906Ef6176f0b5518b418Da08f',
    // AAVE_MARKET: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
    // AAVE_V3_VIEW: '0xf4B715BB788cC4071061bd67dC8B56681460A2fF',
    // ZRX_ALLOWLIST_ADDR: '0x4BA1f38427b33B8ab7Bb0490200dAE1F1C36823F',
    // ZRX_ALLOWLIST_OWNER: '0xBc841B0dE0b93205e912CFBBd1D0c160A1ec6F00',
    // AAVE_SUB_PROXY: '0xb9F73625AA64D46A9b2f0331712e9bEE19e4C3f7',
    // DFS_REG_CONTROLLER: '0x6F6DaE1bCB60F67B2Cb939dBE565e8fD03F6F002',
    // AVG_GAS_PRICE: 100,
  },
};

// async function setup() {
//   // Deploy mọi contract ở địa chỉ trên
//   const ownerAcc = (await hre.ethers.getSigners())[0];
//   const adminVaultInstance = await (await ethers.getContractFactory('AdminVault')).connect(ownerAcc);
//   const adminVault = await (await adminVaultInstance.deploy()).deployed();
//   console.log("Address AdminVault::", adminVault.address);

//   const dfsRegistryInstance = await (await ethers.getContractFactory('DFSRegistry')).connect(ownerAcc);
//   const dfsRegistry = await (await dfsRegistryInstance.deploy()).deployed();
//   console.log("Address DFSRegistry::", dfsRegistry.address);

//   const strategyStorageInstance = await (await ethers.getContractFactory('StrategyStorage')).connect(ownerAcc);
//   const strategyStorage = await (await strategyStorageInstance.deploy()).deployed();
//   console.log("Address StrategyStorage::", strategyStorage.address);

//   const dsGuardFactoryInstance = await (await ethers.getContractFactory('DSGuardFactory')).connect(ownerAcc);
//   const dsGuardFactory = await (await dsGuardFactoryInstance.deploy()).deployed();
//   console.log("Address DSGuardFactory::", dsGuardFactory.address);

//   const bundleStorageInstance = await (await ethers.getContractFactory('BundleStorage')).connect(ownerAcc);
//   const bundleStorage = await (await bundleStorageInstance.deploy()).deployed();
//   console.log("Address BundleStorage::", bundleStorage.address);

//   const testStrategyHelperInstance = await (await ethers.getContractFactory('TestStrategyHelper')).connect(ownerAcc);
//   const testStrategyHelper = await (await testStrategyHelperInstance.deploy()).deployed();
//   console.log("Address TestStrategyHelper::", testStrategyHelper.address);

//   const testStrategyIncreaseInstance = await (await ethers.getContractFactory('TestStrategyIncrease')).connect(ownerAcc);
//   const testStrategyIncrease = await (await testStrategyIncreaseInstance.deploy()).deployed();
//   console.log("Address TestStrategyIncrease::", testStrategyIncrease.address);

//   const testStrategyTriggerInstance = await (await ethers.getContractFactory('TestStrategyTrigger')).connect(ownerAcc);
//   const testStrategyTrigger = await (await testStrategyTriggerInstance.deploy()).deployed();
//   console.log("Address TestStrategyTrigger::", testStrategyTrigger.address);

//   const dsProxyFactoryInstance = await (await ethers.getContractFactory('DSProxyFactory')).connect(ownerAcc);
//   const dsProxyFactory = await (await dsProxyFactoryInstance.deploy()).deployed();
//   console.log("Address DSProxyFactory::", dsProxyFactory.address);
  
//   const proxyRegistryInstance = await (await ethers.getContractFactory('DSProxyRegistry')).connect(ownerAcc);
//   const proxyRegistry = await (await proxyRegistryInstance.deploy(dsProxyFactory.address)).deployed();
//   console.log("Address ProxyRegistry::", proxyRegistry.address);

//   const subProxyInstance = await (await ethers.getContractFactory('SubProxy')).connect(ownerAcc);
//   const subProxy = await (await subProxyInstance.deploy()).deployed();
//   console.log("Address SubProxy::", subProxy.address);

//   const subStorageInstance = await (await ethers.getContractFactory('SubStorage')).connect(ownerAcc);
//   const subStorage = await (await subStorageInstance.deploy()).deployed();
//   console.log("Address SubStorage::", subStorage.address);

//   const proxyAuthInstance = await (await ethers.getContractFactory('ProxyAuth')).connect(ownerAcc);
//   const proxyAuth = await (await proxyAuthInstance.deploy()).deployed(); 
//   console.log("Address ProxyAuth::", proxyAuth.address);

//   const strategyProxyInstance = await (await ethers.getContractFactory('StrategyProxy')).connect(ownerAcc);
//   const strategyProxy = await (await strategyProxyInstance.deploy()).deployed();
//   console.log("Address StrategyProxy::", strategyProxy.address);

//   const recipeExecutorInstance = await (await ethers.getContractFactory('RecipeExecutor')).connect(ownerAcc);
//   const recipeExecutor = await (await recipeExecutorInstance.deploy()).deployed();
//   console.log("Address RecipeExecutor::", recipeExecutor.address);

//   const defisaverLoggerInstance = await (await ethers.getContractFactory('DefisaverLogger')).connect(ownerAcc);
//   const defisaverLogger = await (await defisaverLoggerInstance.deploy()).deployed();
//   console.log("Address DefisaverLogger::", defisaverLogger.address);

//   const testStrategyInstance = await (await ethers.getContractFactory('TestStrategy')).connect(ownerAcc);
//   const testStrategy = await (await testStrategyInstance.deploy()).deployed();
//   console.log("Address TestStrategy::", testStrategy.address);

//   const strategyExecutorInstance = await (await ethers.getContractFactory('StrategyExecutor')).connect(ownerAcc);
//   const strategyExecutor = await (await strategyExecutorInstance.deploy()).deployed();
//   console.log("Address StrategyExecutor::", strategyExecutor.address);

//   const botAuthInstance = await (await ethers.getContractFactory('BotAuth')).connect(ownerAcc);
//   const botAuth = await (await botAuthInstance.deploy()).deployed();
//   console.log("Address BotAuth::", botAuth.address);
// }

// async function setupDFSRegistry() {
//   // Setup địa chỉ vào DFSRegistry
//   const registry = (await hre.ethers.getContractFactory("DFSRegistry")).attach(addrs["testnet"].REGISTRY_ADDR);

//   // Owner là người thực hiện tự động lấy signers[0]
//   await registry.addNewContract(getNameId("StrategyStorage"), testnetOrderAddress[2], 0);
//   await registry.addNewContract(getNameId("BundleStorage"), testnetOrderAddress[4], 0);
//   await registry.addNewContract(getNameId("StrategyExecutorID"), testnetOrderAddress[17], 0);
//   await registry.addNewContract(getNameId("TestStrategyIncrease"), process.env.TEST_STRATEGY_INCREASE_ADDRESS, 0);
//   await registry.addNewContract(getNameId("TestStrategyTrigger"), testnetOrderAddress[7], 0);
//   await registry.addNewContract(getNameId("SubStorage"), testnetOrderAddress[11], 0);
//   await registry.addNewContract(getNameId("BotAuth"), testnetOrderAddress[18], 0);

  
//   const test = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("BotAuth")).substr(0, 10);
//   console.log(await registry.getAddr(getNameId("BotAuth")));
// }

const createStrategy = async (proxy, strategyName, triggerIds, actionIds, paramMapping, continuous) => {
  const storageAddr = await getAddrFromRegistry('StrategyStorage');
  console.log("storageAddr", storageAddr)
  const storage = await hre.ethers.getContractAt('StrategyStorage', storageAddr);
  
  const receipt = await storage.createStrategy(
    strategyName, triggerIds, actionIds, paramMapping, continuous
  );
  await receipt.wait();

  const strategyId = await getLatestStrategyId();

  console.log('StrategyId: ', strategyId);

  return strategyId;
};

const subTestStrategy = async (proxy, val, strategyId) => {
  const isBundle = false;
  
  const targetValueEncoded = abiCoder.encode(['uint256'], [val.toString()]);
  const triggerData = await createTestTrigger(proxy.address, val);

  const strategySub = [strategyId, isBundle, [triggerData], [targetValueEncoded]];
  console.log("strategySub::", strategySub);
  const subId = await subToStrategy(proxy, strategySub);
  console.log("subId::", subId);

  return { subId, strategySub };
};

const subToStrategy = async (proxy, strategySub, regAddr = addrs["testnet"].REGISTRY_ADDR) => {
  const SubProxyAddr = addrs["testnet"].SubProxy;

  const SubProxyProxy = await hre.ethers.getContractFactory('SubProxy');
  const functionData = SubProxyProxy.interface.encodeFunctionData(
    'subscribeToStrategy',
    [strategySub],
  );
  console.log("SubProxyAddr: ", SubProxyAddr)
  console.log("functionData: ", functionData)
  const receipt = await proxy['execute(address,bytes)'](SubProxyAddr, functionData, {
    gasLimit: 1e7,
  });
  await receipt.wait();
  // const gasUsed = await getGasUsed(receipt);
  // const dollarPrice = calcGasToUSD(gasUsed, AVG_GAS_PRICE);
  // console.log(`GasUsed subToStrategy; ${gasUsed}, price at ${AVG_GAS_PRICE} gwei $${dollarPrice}`);

  const latestSubId = await getLatestSubId(regAddr);
  console.log("latestSubId::", latestSubId);

  return latestSubId;
};

const getLatestSubId = async (regAddr = addrs[network].REGISTRY_ADDR) => {
  const subStorageAddr = await getAddrFromRegistry('SubStorage', regAddr);

  const subStorageInstance = await hre.ethers.getContractFactory('SubStorage');
  const subStorage = await subStorageInstance.attach(subStorageAddr);

  let latestSubId = await subStorage.getSubsCount();
  latestSubId = (latestSubId - 1).toString();

  return latestSubId;
};

const createTestTrigger = async (address, value) => {
  const param = abiCoder.encode(["address", 'uint256'], [address, value]);
  return param;
};

const getLatestStrategyId = async () => {
  const strategyStorageAddr = await getAddrFromRegistry('StrategyStorage');
  console.log("strategyStorageAddr::", strategyStorageAddr);

  const strategyStorageInstance = await hre.ethers.getContractFactory('StrategyStorage');
  const strategyStorage = await strategyStorageInstance.attach(strategyStorageAddr);

  let latestStrategyId = await strategyStorage.getStrategyCount();
  latestStrategyId = (latestStrategyId - 1).toString();

  return latestStrategyId;
};

const openStrategyAndBundleStorage = async () => {
  const strategySubAddr = await getAddrFromRegistry('StrategyStorage');
  const bundleSubAddr = await getAddrFromRegistry('BundleStorage');

  console.log("strategySubAddr", strategySubAddr)
  console.log("bundleSubAddr", bundleSubAddr)
  const currOwnerAddr = addrs["testnet"].OWNER_ACC;

  const ownerSigner = await hre.ethers.provider.getSigner(currOwnerAddr);

  // await impersonateAccount(currOwnerAddr);

  let strategyStorage = await hre.ethers.getContractAt('StrategyStorage', strategySubAddr);
  let bundleStorage = await hre.ethers.getContractAt('BundleStorage', bundleSubAddr);

  strategyStorage = strategyStorage.connect(ownerSigner);
  bundleStorage = bundleStorage.connect(ownerSigner);

  await strategyStorage.changeEditPermission(true);
  console.log("strategyStorage changeEditPermission successed!")
  await bundleStorage.changeEditPermission(true);
  console.log("bundleStorage changeEditPermission successed!")
  // await stopImpersonatingAccount(currOwnerAddr);

};

const impersonateAccount = async (account) => {
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [account],
  });
};

const stopImpersonatingAccount = async (account) => {
  await hre.network.provider.request({
    method: 'hardhat_stopImpersonatingAccount',
    params: [account],
  });
};

const getProxy = async (acc) => {
  // Lấy address DSProxy của user
  const proxyRegistry = (await hre.ethers.getContractAt('IProxyRegistry', addrs["testnet"].PROXY_REGISTRY));
  let proxyAddr = await proxyRegistry.proxies(acc);

  // Nếu k tồn tại thì thực hiện tạo mới luôn
  if (proxyAddr === nullAddress) {
    await proxyRegistry.build(acc);
    proxyAddr = await proxyRegistry.proxies(acc);
    console.log("ProxyAddr:: 1", proxyAddr);
  }
  console.log("ProxyAddr::", proxyAddr);

  // Lấy instance contract DSProxy 
  const dsProxy = await hre.ethers.getContractAt('IDSProxy', proxyAddr);

  return dsProxy;
};

function createTestStrategy() {
  // Tạo strategy với name
  const testStrategy = {
    name: "TestStrategy",
    subSlots: {},
    actions: [],
    triggers: [],
    numSubSlots: 0
  }

  // Thêm subslot
  testStrategy.subSlots["&val"] = {
    type: "uint256",
    index: testStrategy.numSubSlots + 128
  }
  testStrategy.numSubSlots++;
  // Bảo người khác dùng strategy của ta rằng: phần tử đầu tiên của mảng subdata lưu trong substorage là tham số truyền vào hàm 

  // Thêm trigger
  const testStrategyTrigger = {
    contractAddress: process.env.TEST_STRATEGY_TRIGGER_ADDRESS,
    paramTypes: ["adress", 'uint256'],
    name: "TestStrategyTrigger",
    args: ['0', '0'],
    mappableArgs: ['0', '0'],
  }
  testStrategy.triggers.push(testStrategyTrigger);

  // Thêm action
  // const testStrategyAction = {
  //   contractAddress: process.env.TEST_STRATEGY_INCREASE_ADDRESS,
  //   paramTypes: ['uint256'],
  //   name: ,
  //   args: ["%val"],
  //   mappableArgs: ["%val"]
  // }
  // testStrategy.actions.push(testStrategyAction);
  const testStrategyAction = new Action("TestStrategyIncrease", process.env.TEST_STRATEGY_INCREASE_ADDRESS, ['uint256'], ["&val"]);
  const paramMappings = [];
  const actionIds = [];
  [testStrategyAction].forEach(action => {
    const actionEncoded = action.encodeForStrategy(testStrategy.subSlots);

    actionIds.push(actionEncoded[0]);
    paramMappings.push(actionEncoded[1]);
  });
  return [
    "TestStrategy",
    testStrategy.triggers.map((trigger) => keccak256(trigger.name).substr(0, 10)),
    actionIds, // cũng chỉ là keccak256("TestStrategyIncrease").substr(0, 10)
    paramMappings, // 128 về sau - 128 = 0 tức subdata[0]
  ];
}

const getAddrFromRegistry = async (name, regAddr = addrs["testnet"].REGISTRY_ADDR) => {
  const registryInstance = await hre.ethers.getContractFactory("DFSRegistry");
  const registry = registryInstance.attach(regAddr);

  const addr = await registry.getAddr(
    getNameId(name),
  );
  return addr;
};

const getNameId = (name) => {
  const hash = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes(name));
  return hash.substr(0, 10);
};

const callTestStrategy = async (addressProxy, botAcc, subId, val, strategyId) => {
  const triggerCallData = [];
  const actionsCallData = [];

  const testStrategyAction = new Action("TestStrategyIncrease", process.env.TEST_STRATEGY_INCREASE_ADDRESS, ['uint256'], [val]);

  const isBundle = false;
  
  const targetValueEncoded = abiCoder.encode(['uint256'], [val.toString()]);
  const triggerData = await createTestTrigger(addressProxy, val);

  const strategySub = [strategyId, false, [triggerData], [targetValueEncoded]];
  actionsCallData.push(testStrategyAction.encodeForRecipe()[0]);
  triggerCallData.push(abiCoder.encode(["address", 'uint256'], [addressProxy, val]));
  const strategyExecutorByBot = await (await hre.ethers.getContractFactory("StrategyExecutor")).attach(process.env.STRATEGY_EXECUTOR_ADDRESS).connect(botAcc);
  const strategyIndex = 0; // Dùng nếu dùng bundle để nói vị trí của strategy trong bundle

  const testStrategyInstance = await (await hre.ethers.getContractFactory("TestStrategy")).attach(process.env.TEST_STRATEGY_ADDRESS);
  console.log(`Trc khi goi trigger, value cua user la::${await testStrategyInstance.getTestStrategy(addressProxy)}`);

  console.log("subId: ", subId)
  console.log("strategyIndex: ", strategyIndex)
  console.log("triggerCallData: ", triggerCallData)
  console.log("actionsCallData: ", actionsCallData)
  console.log("strategySub: ", strategySub)
  // Thực hiện strategy
  const receipt = await strategyExecutorByBot.executeStrategy(subId, strategyIndex, triggerCallData, actionsCallData, strategySub, {
    gasLimit: 8000000,
  });

  console.log(`Sau khi goi trigger, value cua user la::${await testStrategyInstance.getTestStrategy(addressProxy)}`);
  
};

async function setupPermission(ownerAcc, proxy, botAcc) {
  const bothAuth = await (await hre.ethers.getContractFactory("BotAuth")).attach(process.env.BOT_AUTH_ADDRESS);
  await bothAuth.addCaller(botAcc.address);
}

module.exports = {
  // setup,
  // setupDFSRegistry,
  createTestStrategy,
  createStrategy,
  getProxy,
  openStrategyAndBundleStorage,
  subTestStrategy,
  callTestStrategy,
  setupPermission
}