const hre = require('hardhat');
const { expect } = require('chai');

const {
  setup,
  setupDFSRegistry,
  createTestStrategy,
  createStrategy,
  getProxy,
  openStrategyAndBundleStorage,
  subTestStrategy,
  callTestStrategy,
  setupPermission
} = require('./utils');

describe("TestStrategyTest", async function() {
  let ownerAcc;
  let botAcc;
  let adminOfAdminVaultAddress;
  let proxy;
  // let userAcc = "0xf10D28df15Edbd36e172f71a8D7Fb3480c29D31e";
  // let userPivKey = "de3a7a8d98210b07d87e79740094139c368c3c9fcce5abe8212c13591d215c36";
  let strategyId;
  let subId;

  before(async() => {
    ownerAcc = (await hre.ethers.getSigners())[0];
    botAcc = (await hre.ethers.getSigners())[1];
    adminOfAdminVaultAddress = (await hre.ethers.getSigners())[2];
    
    console.log("Owner address::", ownerAcc.address);
    console.log("Bot address::", botAcc.address);
    console.log("Admin of admin vault contract::", adminOfAdminVaultAddress.address);

    // Deploy mọi contract tại địa chỉ fix cứng
    await setup();
    await setupDFSRegistry();

    // K hoạt động
    // userAcc = new ethers.Wallet(userPivKey, ethers.provider);
    // await ownerAcc.sendTransaction({
    //   to: userAcc,
    //   value: ethers.utils.parseEther("2.0"),
    // });

    proxy = await getProxy(ownerAcc.address);

    await setupPermission(ownerAcc, proxy, botAcc);

  });
  it("Create strategy", async() => {
    await openStrategyAndBundleStorage();

    // Tạo ra tham số cho strategy gồm: trigger, action và tham số với các giá trị rỗng, chỉ cần để tạo strategy trước rồi gán giá trị vào sau
    const strategyData = createTestStrategy();

    // Tạo thẳng strategy với trigger, action và tham số lên contract
    strategyId = await createStrategy(proxy, ...strategyData, true);

    // Tạo subdata lưu vào subStorage chứa tham số của người dùng. Ở đây ta lưu trigger data là [Smart wallet của user, 100], còn subdata là [100] => nên nhớ contract chỉ lưu hash của các data này nên khi gọi phải truyền lại để nó so sánh hash
    // Ở đây ta cho trigger check nếu val của user nhỏ hơn 100, thì sẽ cộng thêm 100 vào
    ({ subId } = await subTestStrategy(proxy, 100, strategyId));

  })
  it("Trigger strategy", async() => {
    // Cho bot gọi strategy luôn, phải truyền lại tham số như trên đã nói
    await callTestStrategy(proxy.address, botAcc, subId, 100, strategyId);
  })
})