const { getProxy, testvault } = require("./utils");

describe("Test Pancakeswap", async function() {
  let ownerAcc;
  let accA;
  let proxy;

  before(async() => {
    ownerAcc = (await hre.ethers.getSigners())[0];
    accA = (await hre.ethers.getSigners())[1];
    console.log(`Owner address:: ${ownerAcc.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(ownerAcc.address))} TBNB`);
    console.log(`AccA address:: ${accA.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(accA.address))} TBNB`);

    proxy = await getProxy(ownerAcc.address);
    console.log(`Proxy address:: ${proxy.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(proxy.address))} TBNB`);
  });

  it("Test vault", async() => {
    // Test cung 
    await testvault(ownerAcc, proxy);
  }).timeout(100000000000);

});
