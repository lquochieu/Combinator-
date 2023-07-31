const combinator = require("../../sdk-hieu");
const { getProxy } = require("./utils");

describe("Test Pancakeswap", async function() {
  let ownerAcc;
  let proxy;

  before(async() => {
    ownerAcc = (await hre.ethers.getSigners())[0];
    proxy = await getProxy(ownerAcc.address);

    console.log(`Owner address:: ${ownerAcc.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(ownerAcc.address))} TBNB`);    
    console.log(`Proxy address:: ${proxy.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(proxy.address))} TBNB`);
  });

  it("Test Execute Recipe", async() => {
    const listActions = [
      "WrapBnb"
    ];
    const listParams = [
      {
        amount: "10000000000000000"
      },
    ];
    let tx = await combinator.executeRecipes(proxy, listActions, listParams, {
      value: "10000000000000000"
    });
    tx = await tx.wait();
    console.log("TxHash::", tx.transactionHash);
    console.log(`After::Owner address:: ${ownerAcc.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(ownerAcc.address))} TBNB`);    
  });

  it("Test save recipe and then execute", async() => {
    // Đầu tiên 1 người vào tạo ra recipe
    const listActions = [
      "WrapBnb"
    ];
    const listParams = [
      {
        amount: 0
      },
    ];
    let recipe = combinator.getRecipe(listActions, listParams);
    console.log(recipe);

    // stringify recpie để lưu vào database

    // 1 người khác lấy recipe từ db ra và thực hiện 
    let recipeFromDB = recipe;
    let tx = await combinator.executeExistRecipe(proxy, recipeFromDB, [
      {
        amount: "10000000000000000"
      }
    ]);
    tx = await tx.wait();
    console.log("TxHash::", tx.transactionHash);
    console.log(`After::Owner address:: ${ownerAcc.address} with balance ${hre.ethers.utils.formatEther(await ethers.provider.getBalance(ownerAcc.address))} TBNB`);   
  });
});