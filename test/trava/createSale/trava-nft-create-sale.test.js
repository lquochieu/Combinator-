// Tạo 2 token -> tạo 1 pool vói 2 token -> Test action 1 là addLiquidity cả 2 token đó -> Test action 2 là increaseLiquidity 1 đồng -> Test action 3 là swap -> Test action 4 là collect lãi do 1 thằng khác đã swap ở bước trước > Test aciton 5 là removeLiquidity

const { ethers } = require("hardhat");
const {
  // getProxy,
  addLiquidity,
  increaseLiquidity,
  createPool,
  collectLiquidity,
  removeLiquidity,
  swapExactTokenForToken,
  swapExactInputSingle,
  combinatorPancakeswap,
} = require("../../testrecipepancakeswap/utils");
const { Action } = require("../../teststrategy/Action");
const { getProxy } = require("../../utils");
const { keccak256 } = require("web3-utils");
const abiCoder = new hre.ethers.utils.AbiCoder();
// Account Owner support 2 token
// Account A swap

describe("Test Pancakeswap", async function () {
  let ownerAcc;
  let accA;
  let proxy;
  let tokenA;
  let proxyA;
  let trava;
  // get bignumber 2**96
  const bignumber = ethers.BigNumber.from("2").pow(50);
  console.log("bignumber::", bignumber.toString());
  before(async () => {
    ownerAcc = (await hre.ethers.getSigners())[0];
    accA = (await hre.ethers.getSigners())[1];
    console.log(
      `Owner address:: ${
        ownerAcc.address
      } with balance ${hre.ethers.utils.formatEther(
        await ethers.provider.getBalance(ownerAcc.address)
      )} TBNB`
    );
    console.log(
      `AccA address:: ${
        accA.address
      } with balance ${hre.ethers.utils.formatEther(
        await ethers.provider.getBalance(accA.address)
      )} TBNB`
    );

    // Mint cho Owner 1000 token A
    // const tokenAInstance = await ethers.getContractFactory('ERC20Mock');
    // const tokenA = await tokenAInstance.deploy("Token A", "TKA");
    // await tokenA.deployed();
    // console.log("Address ERC20Mock token A::", tokenA.address);
    // console.log("Balance of Owner::", await tokenA.balanceOf(ownerAcc.address));
    tokenA = (await hre.ethers.getContractFactory("ERC20Mock")).attach(
      process.env.TOKEN_CC1
    );
    console.log(
      "Balance token A of Owner::",
      await tokenA.balanceOf(ownerAcc.address)
    );

    console.log(
      "Balance token A of AccA::",
      await tokenA.balanceOf(accA.address)
    );

    // send 200 token A to accA
    // await tokenA.transfer(accA.address, "200000000000000000000");
    // await tokenA.transfer(ownerAcc.address, "200000000000000000000");

    // Mint cho Owner 1000 token B
    // const tokenBInstance = await ethers.getContractFactory('ERC20Mock');
    // const tokenB = await tokenBInstance.deploy("Token B", "TKB");
    // await tokenB.deployed();
    // console.log("Address ERC20Mock token B::", tokenB.address);
    // console.log("Balance token B of Owner::", await tokenB.balanceOf(ownerAcc.address));
    trava = (await hre.ethers.getContractFactory("ERC20Mock")).attach(
      process.env.TRAVA_TOKEN_IN_MARKET
    );
    console.log(
      "Balance trava of Owner::",
      await trava.balanceOf(ownerAcc.address)
    );

    proxy = await getProxy(ownerAcc.address);
    console.log(
      `Proxy address:: ${
        proxy.address
      } with balance ${hre.ethers.utils.formatEther(
        await ethers.provider.getBalance(proxy.address)
      )} TBNB`
    );

    proxyA = await getProxy(accA.address);
    console.log(
      `ProxyA address:: ${
        proxyA.address
      } with balance ${hre.ethers.utils.formatEther(
        await ethers.provider.getBalance(proxyA.address)
      )} TBNB`
    );

    // await tokenA.transfer(proxyA.address, "200000000000000000000");
    // // Send token to accA
    // await tokenA.transfer(accA.address, "10000000000000000000");
    // await tokenB.transfer(accA.address, "10000000000000000000");
    // console.log("Balance token A of Proxy::", await tokenA.balanceOf(proxy.address));
    // console.log("Balance token B of Proxy::", await tokenB.balanceOf(proxy.address));
  });

  it("Test addLiquidity", async () => {
    // // Gọi trực tiếp executeActionDirect
    // // Uncomment để test
    // await addLiquidity(
    //   ownerAcc,
    //   proxy,
    //   process.env.TRAVA_TOKEN_IN_MARKET,
    //   process.env.TOKEN_B_TEST2,
    //   "2500",
    //   "-28150",
    //   "-26050",
    //   "300000000000000000000",
    //   "299999999999999999999",
    //   "0",
    //   bignumber,
    //   "0x595622cbd0fc4727df476a1172ada30a9ddf8f43",
    //   "2688452425",
    //   "0x595622cbd0fc4727df476a1172ada30a9ddf8f43"
    // );
  });
  it("Test createPool", async () => {
    // Phải tạo lại 2 token mới và thế vào env nhé
    // Action này createPool r cung vào pool luôn
    // Lỗi lạ xuất hiện là do thiếu gasLimit
    // send token A to proxy
    // await tokenA.transfer(proxy.address, "300000000000000000000");
    // await trava.transfer(proxy.address, "200000000000000000000");
    // await createPool(
    //   ownerAcc,
    //   proxy,
    //   process.env.TRAVA_TOKEN_IN_MARKET,
    //   process.env.TOKEN_B_TEST2,
    //   "2500",
    //   "-28150",
    //   "-26050",
    //   "300000000000000000000",
    //   "200000000000000000000",
    //   "0",
    //   bignumber,
    //   "0x595622cbd0fc4727df476a1172ada30a9ddf8f43",
    //   "2688452425",
    //   "0x595622cbd0fc4727df476a1172ada30a9ddf8f43",
    //   "20456476331960289157024907122"
    // );
  });

  it("Test swapExactInputSingle", async () => {
    // // Ta sẽ dùng accountA để swap mà k dùng account owner
    // // Đầu tiên gửi TOKEN_B_TEST2 cho accA cho nó có đủ tiền
    // const tokenA = (
    //   await hre.ethers.getContractAt("ERC20Mock", process.env.TOKEN_B_TEST2)
    // ).connect(ownerAcc);
    // // await tokenA.transfer(accA.address, "1000000000000000000");
    // console.log(
    //   "Balance token A of accA::",
    //   await tokenA.balanceOf(accA.address)
    // );
    // // Lấy proxy của accA để thực hiện thông qua proxy
    // const proxyA = (await getProxy(accA.address)).connect(accA);
    // console.log(
    //   `Proxy address:: ${
    //     proxyA.address
    //   } with balance ${hre.ethers.utils.formatEther(
    //     await ethers.provider.getBalance(proxyA.address)
    //   )} TBNB`
    // );
    // // check balance of proxyA
    // console.log(
    //   `Proxy A address:: ${
    //     proxyA.address
    //   } with balance ${hre.ethers.utils.formatEther(
    //     await tokenA.balanceOf(proxyA.address)
    //   )} TokenA`
    // );
    // // send token A to proxyA
    // // await tokenA.transfer(proxyA.address, "1000000000000000000");
    // // await tokenA.connect(accA).approve(proxyA.address, "10000000000000000");
    // // Phải approve cho router contract => trong contract đã có rồi
    // await swapExactInputSingle(
    //   accA,
    //   proxyA,
    //   process.env.TOKEN_B_TEST2,
    //   process.env.TRAVA_BSCTESTNET,
    //   "2500",
    //   accA.address,
    //   "1000000000000000",
    //   "0",
    //   "0",
    //   accA.address
    // );
  });

  it("Test proxy buy nft", async () => {
    // console.log("Balance trava of accA::", await trava.balanceOf(accA.address));
    // const proxyA = await getProxy(accA.address);
    // //
    // const tokenID = "5433";
    // const makeOrder = new Action(
    //   "MakeOrder",
    //   process.env.TRAVA_NFT_BUY_ADDRESS,
    //   ["uint256", "address", "address"],
    //   [tokenID, accA.address, accA.address]
    // );
    // const callDataMakeOrder = makeOrder.encodeForDsProxyCall()[1];
    // // // approve for proxyA
    // // await trava
    // //   .connect(accA)
    // //   .approve(proxyA.address, ethers.utils.parseEther("50"));
    // let tx = await proxyA
    //   .connect(accA)
    //   .execute(process.env.TRAVA_NFT_BUY_ADDRESS, callDataMakeOrder, {
    //     gasLimit: 1e7,
    //   });
    // // tx = await tx.wait();
    // console.log("tx :", tx);
  });
  it("Test create sale nft ", async () => {
    // const tokenID = "4330";
    // const createSaleAction = new Action(
    //   "NFT Transfer",
    //   process.env.TRAVA_NFT_CREATE_SALE_ADDRESS,
    //   ["uint256", "uint256", "address"],
    //   [tokenID, ethers.utils.parseEther("10"), ownerAcc.address]
    // );
    // const callDataCreateSale = createSaleAction.encodeForDsProxyCall()[1];
    // const NFTCore = await hre.ethers.getContractAt(
    //   "INFTCore",
    //   process.env.TRAVA_NFT_CORE
    // );
    // await NFTCore.approve(proxy.address, tokenID);
    // const tx = await proxy.execute(
    //   process.env.TRAVA_NFT_CREATE_SALE_ADDRESS,
    //   callDataCreateSale,
    //   { gasLimit: 1e7 }
    // );
    // console.log("tx::", tx);
  });
  it("Test buy nft , after sell it", async () => {
    let triggerCallData = [];
    let actionsCallData = [];
    let subData = [];
    let actionIds = [];

    const tokenID = "4129";

    const makeOrderAction = new Action(
      "MakeOrder",
      process.env.TRAVA_NFT_BUY_ADDRESS,
      ["uint256", "address", "address"],
      [tokenID, accA.address, accA.address]
    );

    const createSaleAction = new Action(
      "NFT Transfer",
      process.env.TRAVA_NFT_CREATE_SALE_ADDRESS,
      ["uint256", "uint256", "address"],
      [tokenID, ethers.utils.parseEther("10"), accA.address]
    );

    const callDataMakeOrder = makeOrderAction.encodeForRecipe()[0];
    const callDataCreateSale = createSaleAction.encodeForRecipe()[0];

    actionsCallData.push(callDataMakeOrder);
    actionsCallData.push(callDataCreateSale);

    const paramMapping = [
      [128, 129, 130],
      [131, 132, 133],
    ];
    const subdataMakeOrderTokenID = abiCoder.encode(["uint256"], [tokenID]);
    const subdataMakeOrderFrom = abiCoder.encode(["address"], [accA.address]);
    const subdataMakeOrderRecipient = abiCoder.encode(
      ["address"],
      [accA.address]
    );

    const subdataCreateSaleTokenID = abiCoder.encode(["uint256"], [tokenID]);
    const subdataCreateSaleAmount = abiCoder.encode(
      ["uint256"],
      [ethers.utils.parseEther("10")]
    );
    const subdataCreateSaleFrom = abiCoder.encode(["address"], [accA.address]);

    actionIds = [
      keccak256("TravaNFTBuy").substr(0, 10),
      keccak256("TravaNFTCreateSale").substr(0, 10),
    ];

    subData = [
      subdataMakeOrderTokenID,
      subdataCreateSaleFrom,
      subdataMakeOrderRecipient,
      subdataCreateSaleTokenID,
      subdataCreateSaleAmount,
      subdataCreateSaleFrom,
    ];

    // await trava
    //   .connect(accA)
    //   .approve(proxyA.address, ethers.utils.parseEther("50"));

    const NFTCore = await hre.ethers.getContractAt(
      "INFTCore",
      process.env.TRAVA_NFT_CORE
    );
    // // not have approve
    // await NFTCore.connect(accA).setApprovalForAll(proxyA.address, true);
    // console.log(
    //   "Balance token A of proxyA::",
    //   ethers.utils.formatEther(await tokenA.balanceOf(proxyA.address))
    // );

    await NFTCore.connect(accA).approve(proxyA.address, tokenID);

    const RecipeExecutorContract = await hre.ethers.getContractAt(
      "RecipeExecutor",
      process.env.RECIPE_EXECUTOR_ADDRESS
    );
    const calldata = RecipeExecutorContract.interface.encodeFunctionData(
      "executeRecipe",
      [
        {
          name: "TravaCreateSellRecipe",
          callData: actionsCallData,
          subData: subData,
          actionIds: actionIds,
          paramMapping: paramMapping,
        },
      ]
    );
    // console.log("calldata::", calldata);
    const tx = await proxyA
      .connect(accA)
      .execute(process.env.RECIPE_EXECUTOR_ADDRESS, calldata, {
        gasLimit: 1e7,
      });
    await tx.wait();
    console.log("tx::", tx);
    // check amount of token A of proxyA
  });
});
