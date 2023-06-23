const hre = require('hardhat');
const ActionAbi = require('./Action.json');
const AbiCoder = require('web3-eth-abi');
const { Action } = require('./Action');
const { keccak256 } = require('web3-utils');
const abiCoder = new hre.ethers.utils.AbiCoder();

const nullAddress = '0x0000000000000000000000000000000000000000';

const testnetOrderAddress = [
  "0x5729494DA09117516e8F4655Ecfe0bdf928fF847",
  "0x90329F894e796B49B39e255eE1E5EB330d320Da2",
  "0xf69C19d129576536Da21273C1bf3111670574639", // Contract StrategyStorage
  "0x963A559d299a228D3653f19564913a213503383f", // FACTORY_ADDRESS là Contract DSGuardFactory
  "0xf79B1521c352294d65d9447A63B974A57F4a9D0b", // Contract BundleStorage
  "0x54Ad6976Ad97E36D4814cec3180795bDD6B9D75A", // Contract TestStrategyHelper
  "0xdA4F54aed6e3492A86ef4429CEDDcC94E1A2114d", // Contract TestStrategyIncrease
  "0x0929Eff68a85e754899c9C807AB46bFFb4cF0A88", // Contract TestStrategyTrigger
  "0x692f7c150828B0280Dd432b36Bfdd374a7022b18", // Contract DSProxyFactory
  "0x1542435972f5B737b17e522Ca39445d525B019D1",
  "0x0DaD73C374344e389e8E7Ef269bbce04849D6252",
  "0xe7E325A928fD9400454Eb41584Db1e6f6ddfe977", // Contract substorage
  "0xD09ab289A818Ce6E26Ed52b97FAebc0118528141", // Contract ProxyAuth
  "0xA0D9346256adf1A6002Da0008520401a7e3b7966", // 13
  "0x51De9A03227B540e43A708AdbF16B8958840242b", // Contract RecipeExecutor
  "0xCab468876b8bea30554FF4B9B3707ce8DA24EA64", // Contract DefisaverLogger
  "0xC705070242edC08365C54Ee5f3a4242d52b2befD", // Contract TestStrategy
  "0xfAc3f72ff9c023b97ea766e63c7860A733dB7172", // Contract StrategyExecutor
  "0x6925C300A200af588719a13D971dBCf4d580Ad1E", // Contract BotAuth
  "0x49F87662AB0B3AF4dA602756A485521545dBf625",
  "0x789608aE2cF93f4669E0e11D6fF8DB01A2706b2F",
  "0xF4B7Ec97d56B16A61531B8c5Dd74Bb37c68b2487",
]

const addrs = {
  testnet: {
    ADMIN_VAULT: testnetOrderAddress[0],
    REGISTRY_ADDR: testnetOrderAddress[1],
    OWNER_ACC: '0xE55c912440c2bEAAB41bCCDB26908Cf8545846d8',
    ADMIN_ACC: '0x7c1D8EC0D2aF6e6083d80D28fF9dFe903Fb7d955',
    PROXY_REGISTRY: testnetOrderAddress[9],
    SubProxy: testnetOrderAddress[10],
    StrategyProxy: testnetOrderAddress[13],
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

async function setup() {
  // Deploy mọi contract ở địa chỉ trên
  const ownerAcc = (await hre.ethers.getSigners())[0];
  const adminVaultInstance = await (await ethers.getContractFactory('AdminVault')).connect(ownerAcc);
  const adminVault = await (await adminVaultInstance.deploy()).deployed();
  console.log("Address AdminVault::", adminVault.address);

  const dfsRegistryInstance = await (await ethers.getContractFactory('DFSRegistry')).connect(ownerAcc);
  const dfsRegistry = await (await dfsRegistryInstance.deploy()).deployed();
  console.log("Address DFSRegistry::", dfsRegistry.address);

  const strategyStorageInstance = await (await ethers.getContractFactory('StrategyStorage')).connect(ownerAcc);
  const strategyStorage = await (await strategyStorageInstance.deploy()).deployed();
  console.log("Address StrategyStorage::", strategyStorage.address);

  const dsGuardFactoryInstance = await (await ethers.getContractFactory('DSGuardFactory')).connect(ownerAcc);
  const dsGuardFactory = await (await dsGuardFactoryInstance.deploy()).deployed();
  console.log("Address DSGuardFactory::", dsGuardFactory.address);

  const bundleStorageInstance = await (await ethers.getContractFactory('BundleStorage')).connect(ownerAcc);
  const bundleStorage = await (await bundleStorageInstance.deploy()).deployed();
  console.log("Address BundleStorage::", bundleStorage.address);

  const testStrategyHelperInstance = await (await ethers.getContractFactory('TestStrategyHelper')).connect(ownerAcc);
  const testStrategyHelper = await (await testStrategyHelperInstance.deploy()).deployed();
  console.log("Address TestStrategyHelper::", testStrategyHelper.address);

  const testStrategyIncreaseInstance = await (await ethers.getContractFactory('TestStrategyIncrease')).connect(ownerAcc);
  const testStrategyIncrease = await (await testStrategyIncreaseInstance.deploy()).deployed();
  console.log("Address TestStrategyIncrease::", testStrategyIncrease.address);

  const testStrategyTriggerInstance = await (await ethers.getContractFactory('TestStrategyTrigger')).connect(ownerAcc);
  const testStrategyTrigger = await (await testStrategyTriggerInstance.deploy()).deployed();
  console.log("Address TestStrategyTrigger::", testStrategyTrigger.address);

  const dsProxyFactoryInstance = await (await ethers.getContractFactory('DSProxyFactory')).connect(ownerAcc);
  const dsProxyFactory = await (await dsProxyFactoryInstance.deploy()).deployed();
  console.log("Address DSProxyFactory::", dsProxyFactory.address);
  
  const proxyRegistryInstance = await (await ethers.getContractFactory('DSProxyRegistry')).connect(ownerAcc);
  const proxyRegistry = await (await proxyRegistryInstance.deploy(dsProxyFactory.address)).deployed();
  console.log("Address ProxyRegistry::", proxyRegistry.address);

  const subProxyInstance = await (await ethers.getContractFactory('SubProxy')).connect(ownerAcc);
  const subProxy = await (await subProxyInstance.deploy()).deployed();
  console.log("Address SubProxy::", subProxy.address);

  const subStorageInstance = await (await ethers.getContractFactory('SubStorage')).connect(ownerAcc);
  const subStorage = await (await subStorageInstance.deploy()).deployed();
  console.log("Address SubStorage::", subStorage.address);

  const proxyAuthInstance = await (await ethers.getContractFactory('ProxyAuth')).connect(ownerAcc);
  const proxyAuth = await (await proxyAuthInstance.deploy()).deployed(); 
  console.log("Address ProxyAuth::", proxyAuth.address);

  const strategyProxyInstance = await (await ethers.getContractFactory('StrategyProxy')).connect(ownerAcc);
  const strategyProxy = await (await strategyProxyInstance.deploy()).deployed();
  console.log("Address StrategyProxy::", strategyProxy.address);

  const recipeExecutorInstance = await (await ethers.getContractFactory('RecipeExecutor')).connect(ownerAcc);
  const recipeExecutor = await (await recipeExecutorInstance.deploy()).deployed();
  console.log("Address RecipeExecutor::", recipeExecutor.address);

  const defisaverLoggerInstance = await (await ethers.getContractFactory('DefisaverLogger')).connect(ownerAcc);
  const defisaverLogger = await (await defisaverLoggerInstance.deploy()).deployed();
  console.log("Address DefisaverLogger::", defisaverLogger.address);

  const testStrategyInstance = await (await ethers.getContractFactory('TestStrategy')).connect(ownerAcc);
  const testStrategy = await (await testStrategyInstance.deploy()).deployed();
  console.log("Address TestStrategy::", testStrategy.address);

  const strategyExecutorInstance = await (await ethers.getContractFactory('StrategyExecutor')).connect(ownerAcc);
  const strategyExecutor = await (await strategyExecutorInstance.deploy()).deployed();
  console.log("Address StrategyExecutor::", strategyExecutor.address);

  const botAuthInstance = await (await ethers.getContractFactory('BotAuth')).connect(ownerAcc);
  const botAuth = await (await botAuthInstance.deploy()).deployed();
  console.log("Address BotAuth::", botAuth.address);
}

async function setupDFSRegistry() {
  // Setup địa chỉ vào DFSRegistry
  const registry = (await hre.ethers.getContractFactory("DFSRegistry")).attach(addrs["testnet"].REGISTRY_ADDR);

  // Owner là người thực hiện tự động lấy signers[0]
  await registry.addNewContract(getNameId("StrategyStorage"), testnetOrderAddress[2], 0);
  await registry.addNewContract(getNameId("BundleStorage"), testnetOrderAddress[4], 0);
  await registry.addNewContract(getNameId("StrategyExecutorID"), testnetOrderAddress[17], 0);
  await registry.addNewContract(getNameId("TestStrategyIncrease"), testnetOrderAddress[6], 0);
  await registry.addNewContract(getNameId("TestStrategyTrigger"), testnetOrderAddress[7], 0);
  await registry.addNewContract(getNameId("SubStorage"), testnetOrderAddress[11], 0);
  await registry.addNewContract(getNameId("BotAuth"), testnetOrderAddress[18], 0);

  
  const test = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("BotAuth")).substr(0, 10);
  console.log(await registry.getAddr(getNameId("BotAuth")));
}

const createStrategy = async (proxy, strategyName, triggerIds, actionIds, paramMapping, continuous) => {
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

  const receipt = await proxy['execute(address,bytes)'](SubProxyAddr, functionData, {
    gasLimit: 5000000,
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

  const currOwnerAddr = addrs["testnet"].OWNER_ACC;

  const ownerSigner = await hre.ethers.provider.getSigner(currOwnerAddr);

  await impersonateAccount(currOwnerAddr);

  let strategyStorage = await hre.ethers.getContractAt('StrategyStorage', strategySubAddr);
  let bundleStorage = await hre.ethers.getContractAt('BundleStorage', bundleSubAddr);

  strategyStorage = strategyStorage.connect(ownerSigner);
  bundleStorage = bundleStorage.connect(ownerSigner);

  await strategyStorage.changeEditPermission(true);
  await bundleStorage.changeEditPermission(true);

  await stopImpersonatingAccount(currOwnerAddr);

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
    contractAddress: testnetOrderAddress[7],
    paramTypes: ["adress", 'uint256'],
    name: "TestStrategyTrigger",
    args: ['0', '0'],
    mappableArgs: ['0', '0'],
  }
  testStrategy.triggers.push(testStrategyTrigger);

  // Thêm action
  // const testStrategyAction = {
  //   contractAddress: testnetOrderAddress[6],
  //   paramTypes: ['uint256'],
  //   name: ,
  //   args: ["%val"],
  //   mappableArgs: ["%val"]
  // }
  // testStrategy.actions.push(testStrategyAction);
  const testStrategyAction = new Action("TestStrategyIncrease", testnetOrderAddress[6], ['uint256'], ["&val"]);
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

  const testStrategyAction = new Action("TestStrategyIncrease", testnetOrderAddress[6], ['uint256'], [val]);

  const isBundle = false;
  
  const targetValueEncoded = abiCoder.encode(['uint256'], [val.toString()]);
  const triggerData = await createTestTrigger(addressProxy, val);

  const strategySub = [strategyId, false, [triggerData], [targetValueEncoded]];
  actionsCallData.push(testStrategyAction.encodeForRecipe()[0]);
  triggerCallData.push(abiCoder.encode(["address", 'uint256'], [addressProxy, val]));
  const strategyExecutorByBot = await (await hre.ethers.getContractFactory("StrategyExecutor")).attach(testnetOrderAddress[17]).connect(botAcc);
  const strategyIndex = 0; // Dùng nếu dùng bundle để nói vị trí của strategy trong bundle

  
  const testStrategyInstance = await (await hre.ethers.getContractFactory("TestStrategy")).attach(testnetOrderAddress[16]);
  console.log(`Trc khi goi trigger, value cua user la::${await testStrategyInstance.getTestStrategy(addressProxy)}`);

  // Thực hiện strategy
  const receipt = await strategyExecutorByBot.executeStrategy(subId, strategyIndex, triggerCallData, actionsCallData, strategySub, {
    gasLimit: 8000000,
  });

  console.log(`Sau khi goi trigger, value cua user la::${await testStrategyInstance.getTestStrategy(addressProxy)}`);
  
};

async function setupPermission(ownerAcc, proxy, botAcc) {
  const bothAuth = await (await hre.ethers.getContractFactory("BotAuth")).attach(testnetOrderAddress[18]);
  await bothAuth.addCaller(botAcc.address);
}

module.exports = {
  setup,
  setupDFSRegistry,
  createTestStrategy,
  createStrategy,
  getProxy,
  openStrategyAndBundleStorage,
  subTestStrategy,
  callTestStrategy,
  setupPermission
}