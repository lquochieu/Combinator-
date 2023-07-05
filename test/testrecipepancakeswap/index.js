// Tạo 2 token -> tạo 1 pool vói 2 token -> Test action 1 là addLiquidity cả 2 token đó -> Test action 2 là increaseLiquidity 1 đồng -> Test action 3 là swap -> Test action 4 là collect lãi do 1 thằng khác đã swap ở bước trước > Test aciton 5 là removeLiquidity

const { getProxy, createPool } = require("./utils");

// Account Owner support 2 token
// Account A swap

describe("Test Pancake", async function() {
  let ownerAcc;
  let accA;
  let accB;
  let proxy;

  before(async() => {
    ownerAcc = (await hre.ethers.getSigners())[0];
    accA = (await hre.ethers.getSigners())[1];
    console.log(`Owner address:: ${ownerAcc.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(ownerAcc.address))} TBNB`);
    console.log(`AccA address:: ${accA.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(accA.address))} TBNB`);

    // Mint cho Owner 1000 token A
    // const tokenAInstance = await ethers.getContractFactory('ERC20Mock');
    // const tokenA = await tokenAInstance.deploy("Token A", "TKA");
    // await tokenA.deployed();
    // console.log("Address ERC20Mock token A::", tokenA.address);
    // console.log("Balance of Owner::", await tokenA.balanceOf(ownerAcc.address));
    const tokenA = (await hre.ethers.getContractFactory("ERC20Mock")).attach(process.env.TOKEN_A_TEST);
    console.log("Balance token A of Owner::", await tokenA.balanceOf(ownerAcc.address));
    
    // Mint cho Owner 1000 token B
    // const tokenBInstance = await ethers.getContractFactory('ERC20Mock');
    // const tokenB = await tokenBInstance.deploy("Token B", "TKB");
    // await tokenB.deployed();
    // console.log("Address ERC20Mock token B::", tokenB.address);
    // console.log("Balance token B of Owner::", await tokenB.balanceOf(ownerAcc.address));
    const tokenB = (await hre.ethers.getContractFactory("ERC20Mock")).attach(process.env.TOKEN_B_TEST);
    console.log("Balance token B of Owner::", await tokenB.balanceOf(ownerAcc.address));

    proxy = await getProxy(ownerAcc.address);
    console.log(`Proxy address:: ${proxy.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(proxy.address))} TBNB`);

    // Send token to SW
    // await tokenA.transfer(proxy.address, "11000000000000000000");
    // await tokenB.transfer(proxy.address, "11000000000000000000");
    console.log("Balance token A of Proxy::", await tokenA.balanceOf(proxy.address));
    console.log("Balance token B of Proxy::", await tokenB.balanceOf(proxy.address));
  });

  it("Test create new pool", async() => {
    // Gọi trực tiếp executeActionDirect
    await createPool(
      proxy, 
      "0x8d008b313c1d6c7fe2982f62d32da7507cf43551", 
      "0xae13d989dac2f0debff460ac112a837c89baa7cd", 
      "2500", 
      "-76150", 
      "-67300", 
      "668675521294160935",
      "1000000000000000", 
      "0", 
      "0", 
      "0x595622cbd0fc4727df476a1172ada30a9ddf8f43", 
      "2688452425",
      "0x595622cbd0fc4727df476a1172ada30a9ddf8f43"
    );
  });
  it("Test increase liquidity", async() => {

  })
});
