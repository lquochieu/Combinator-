const hre = require('hardhat');
const { expect } = require('chai');
const { getProxy, setupPermission, createXStrategy, createStrategy, getAddrFromRegistry, subTestStrategy, callStrategy } = require("./utils");

describe("TestWrapBNB", async function() {
  let ownerAcc;
  let userAcc;
  let proxy;
  let strategyId = 0;
  let receiverAcc;
  let subId = 0;
  let params;

  before(async() => {
    ownerAcc = (await hre.ethers.getSigners())[0];
    userAcc = (await hre.ethers.getSigners())[1];
    botAcc = (await hre.ethers.getSigners())[2];
    receiverAcc = (await hre.ethers.getSigners())[3];
    console.log(`Owner address:: ${ownerAcc.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(ownerAcc.address))} BNB`);
    console.log(`User address:: ${userAcc.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(userAcc.address))} BNB`);
    console.log(`Bot address:: ${botAcc.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(botAcc.address))} BNB`);
    console.log(`Receiver address:: ${receiverAcc.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(receiverAcc.address))} BNB`);

    proxy = await getProxy(userAcc.address, userAcc);
    
    // !!!!!****** Uncomment để cung thêm cho proxy, nếu proxy hết tiền sẽ k chạy được
    await ownerAcc.sendTransaction({
      to: proxy.address,
      value: ethers.utils.parseEther("0.1"),
    });

    console.log(`Proxy address:: ${proxy.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(proxy.address))} TBNB`);

    await setupPermission(botAcc);
  });

  it("Create Trigger And Strategy", async() => {
    
    // Deploy trigger và add vào registry
    const registry = (await hre.ethers.getContractFactory("DFSRegistry")).attach(process.env.DFS_REGISTRY_ADDRESS);
    const hash = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("BNBBalanceTrigger")).substr(0, 10);
    console.log("JLKJLKJLK::", hash);
    console.log(await registry.isRegistered(hash));
    if(!await registry.isRegistered(hash)){
      const BNBBalanceTriggerInstance = await (await ethers.getContractFactory('BNBBalanceTrigger')).connect(ownerAcc);
      const BNBBalanceTrigger = await (await BNBBalanceTriggerInstance.deploy()).deployed();
      console.log("Address BNBBalanceTrigger::", BNBBalanceTrigger.address);
      await registry.addNewContract(hash, BNBBalanceTrigger.address, 0);
    }
    
    // Đã tạo XStrategy vào id = 0 nên k cần tạo lại nữa
    //const strategyData = createXStrategy();
    // strategyId = await createStrategy(...strategyData, true);
    // console.log(strategyId);
    const storageAddr = await getAddrFromRegistry('StrategyStorage');
    const storage = await hre.ethers.getContractAt('StrategyStorage', storageAddr);
    const strategyCheck = await storage.getStrategy(strategyId);
    console.log("strategyCheck::", strategyCheck);

    // Giả sử: user wrap 0.1BNB -> send tới account khác 0.05WBNB -> unwrap 0.05WBNB còn lại
    // Ta k có nhu cầu thay đổi hay gọi nhiều lần gì hết, tức là triggerdata fix cứng lúc tạo subdata, actiondata cũng lấy từ subdata và k quan tâm _returnValues và NO_PARAMS_OPERATOR
    params = hre.ethers.utils.parseUnits('0.1', '18');

    // Đã tạo subdata có id = 0, k cần tạo lại nữa 
    // ({ subId } = await subTestStrategy(proxy, params, receiverAcc.address, strategyId, ownerAcc.address));
    // console.log(subId);
    const subStorageAddr = await getAddrFromRegistry('SubStorage', process.env.DFS_REGISTRY_ADDRESS);
    const subStorageInstance = await hre.ethers.getContractFactory('SubStorage');
    const subStorage = await subStorageInstance.attach(subStorageAddr);
    const subdata = await subStorage.getSub(subId);
    console.log("Subdata: ", subdata);
  });
  it("Trigger strategy", async() => {
    console.log("Before calling strategy::");
    const wbnbContract = (await hre.ethers.getContractAt('IWBNB', process.env.WBNB_BSCTESTNET));
    console.log("Balance of receiver:: ", await wbnbContract.balanceOf(receiverAcc.address));

    await callStrategy(proxy.address, botAcc, subId, params, receiverAcc.address, ownerAcc, strategyId);
  })
});
