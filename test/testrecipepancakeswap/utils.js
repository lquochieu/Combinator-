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

const addLiquidity = async (owner, proxy, token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from) => {
  await approve(token0, proxy.address);
  await approve(token1, proxy.address);

  console.log("Run to addLiquidity");
  const addLiquidityAction = new Action(
    "PancakeAddLiquidityV3",
    process.env.PANCAKE_ADD_LIQUIDITY_V3_ADDRESS,
    ["address", "address", "uint24", "int24", "int24", "uint256", "uint256", "uint256", "uint256", "address", "uint256", "address"],
    [token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from]
  );
  // console.log(token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from);
  const functionData = addLiquidityAction.encodeForDsProxyCall()[1];
  // console.log(functionData);

  const createPoolContract = await getAddrFromRegistry("PancakeAddLiquidityV3");
  // console.log(createPoolContract);

  const position = await hre.ethers.getContractAt("INonfungiblePositionManager",process.env.NON_FUNGIBLE_POSITION_MANAGER);
  const length = await position.balanceOf(owner.address);
  console.log("Before, balance of user::", length);
  for(var i = 0; i < length; i++){
    console.log("::", await position.tokenOfOwnerByIndex(owner.address, i));
  }

  let tx = await proxy["execute(address,bytes)"](
    createPoolContract,
    functionData
  );
  tx = await tx.wait();
  console.log(tx);
  console.log("tx hash::", tx.transactionHash);

  const length2 = await position.balanceOf(owner.address);
  console.log("After, balance of user::", length2);
  console.log("Last index tokenid is::", await position.tokenOfOwnerByIndex(owner.address, length2 - 1));
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
      const allowance = await tokenContract.allowance(from, to);
      console.log("allowance::", allowance);
    } else {
      await tokenContract.approve(to, hre.ethers.constants.MaxUint256, { gasLimit: 1000000 });
      const allowance = await tokenContract.allowance(from, to);
      console.log("allowance::", allowance);
    }
  }
};

const increaseLiquidity = async (proxy, token0, token1, tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline, from) => {
  console.log("Run to increaseLiquidity");
  await approve(token0, proxy.address);
  await approve(token1, proxy.address);
  const increaseLiquidityAction = new Action(
    "PancakeIncreaseLiquidityV3",
    process.env.PANCAKE_INCREASE_LIQUIDITY_V3_ADDRESS,
    ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256", "address"],
    [tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline, from]
  );
  const functionData = increaseLiquidityAction.encodeForDsProxyCall()[1];

  const createPoolContract = await getAddrFromRegistry("PancakeIncreaseLiquidityV3");
  console.log(createPoolContract);

  const position = await hre.ethers.getContractAt("INonfungiblePositionManager",process.env.NON_FUNGIBLE_POSITION_MANAGER);
  console.log("Before, tokenPosition::", (await position.positions(tokenId)).liquidity);

  let tx = await proxy["execute(address,bytes)"](
    createPoolContract,
    functionData
  );
  tx = await tx.wait();
  console.log("tx hash::", tx.transactionHash);

  console.log("After, tokenPosition::", (await position.positions(tokenId)).liquidity);
}

const createPool = async (owner, proxy, token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from, sqrtPriceX96) => {
  console.log("Run to createPool");
  await approve(token0, proxy.address);
  await approve(token1, proxy.address);

  await approve(token0, "0x427bF5b37357632377eCbEC9de3626C71A5396c1");
  await approve(token1, "0x427bF5b37357632377eCbEC9de3626C71A5396c1");
  const createPoolAction = new Action(
    "PancakeCreatePoolV3",
    process.env.PANCAKE_CREATE_POOL_V3_ADDRESS,
    ["address", "address", "uint24", "int24", "int24", "uint256", "uint256", "uint256", "uint256", "address", "uint256", "address", "uint160"],
    [token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from, sqrtPriceX96]
  );
  console.log(token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline, from, sqrtPriceX96);
  const functionData = createPoolAction.encodeForDsProxyCall()[1];

  const createPoolContract = await getAddrFromRegistry("PancakeCreatePoolV3");
  console.log(createPoolContract);

  const position = await hre.ethers.getContractAt("INonfungiblePositionManager",process.env.NON_FUNGIBLE_POSITION_MANAGER);
  const length = await position.balanceOf(owner.address);
  console.log("Before, balance of user::", length);
  for(var i = 0; i < length; i++){
    console.log("::", await position.tokenOfOwnerByIndex(owner.address, i));
  }

  let tx = await proxy["execute(address,bytes)"](
    createPoolContract,
    functionData, {
      gasLimit: 10000000, // éo hiểu sao bỏ cái này đi gây lỗi
    }
  );
  tx = await tx.wait();
  console.log("tx hash::", tx.transactionHash);

  const length2 = await position.balanceOf(owner.address);
  console.log("After, balance of user::", length2);
  console.log("Last index is::", await position.tokenOfOwnerByIndex(owner.address, length2 - 1));
}

const collectLiquidity = async (owner, proxy, tokenId, recipient, amount0Max, amount1Max) => {
  console.log("Run to collectLiquidity");
  
  const createPoolAction = new Action(
    "PancakeCollectV3",
    process.env.PANCAKE_COLLECT_V3_ADDRESS,
    ["uint256", "address", "uint128", "uint128"],
    [tokenId, recipient, amount0Max, amount1Max]
  );
  console.log(tokenId, recipient, amount0Max, amount1Max);
  const functionData = createPoolAction.encodeForDsProxyCall()[1];

  const createPoolContract = await getAddrFromRegistry("PancakeCollectV3");
  console.log(createPoolContract);

  const position = await hre.ethers.getContractAt("INonfungiblePositionManager",process.env.NON_FUNGIBLE_POSITION_MANAGER);
  const length = await position.positions(tokenId);
  console.log("Before, position of token::", length);

  let tx = await proxy["execute(address,bytes)"](
    createPoolContract,
    functionData, {
      gasLimit: 10000000,
    }
  );
  tx = await tx.wait();
  console.log("tx hash::", tx.transactionHash);

  const length2 = await position.positions(tokenId);
  console.log("After, position of token::", length2);
}

const swapExactTokenForToken = async (owner, proxy, amountIn, amountOutMin, path, to, from) => {
  console.log("Run to swapExactTokenForToken");
  const createPoolAction = new Action(
    "PancakeSwapV2",
    process.env.PANCAKE_SWAP_V2_ADDRESS,
    ["uint256", "uint256", "address[]", "address", "uint256", "address"],
    [amountIn, amountOutMin, path, to, "1000000000000000000", from]
  );

  console.log(amountIn, amountOutMin, path, to, from);
  const functionData = createPoolAction.encodeForDsProxyCall()[1];

  const createPoolContract = await getAddrFromRegistry("PancakeSwapV2");
  console.log(createPoolContract);

  const tokenA = (await hre.ethers.getContractAt("ERC20Mock", path[path.length - 1]));
  console.log("Before, balance token CAKE of owner::", await tokenA.balanceOf(owner.address));

  let tx = await proxy["execute(address,bytes)"](
    createPoolContract,
    functionData, {
      gasLimit: 10000000
    }
  );
  tx = await tx.wait();
  console.log("tx hash::", tx.transactionHash);

  console.log("After, balance token CAKE of accA::", await tokenA.balanceOf(owner.address));
}

const removeLiquidity = async (owner, proxy, tokenId, liquidity, amount0Min, amount1Min, deadline) => {
  console.log("Run to removeLiquidity");
  const createPoolAction = new Action(
    "PancakeRemoveLiquidityV3",
    process.env.PANCAKE_REMOVE_LIQUIDITY_V3_ADDRESS,
    ["uint256", "uint128", "uint256", "uint256", "uint256"],
    [tokenId, liquidity, amount0Min, amount1Min, deadline]
  );

  console.log(tokenId, liquidity, amount0Min, amount1Min, deadline);
  const functionData = createPoolAction.encodeForDsProxyCall()[1];

  const createPoolContract = await getAddrFromRegistry("PancakeRemoveLiquidityV3");
  console.log(createPoolContract);

  const position = await hre.ethers.getContractAt("INonfungiblePositionManager",process.env.NON_FUNGIBLE_POSITION_MANAGER);
  const length = await position.positions(tokenId);
  console.log("Before, position of token::", length);

  let tx = await proxy["execute(address,bytes)"](
    createPoolContract,
    functionData, {
      gasLimit: 10000000,
    }
  );
  tx = await tx.wait();
  console.log("tx hash::", tx.transactionHash);

  const length2 = await position.positions(tokenId);
  console.log("After, position of token::", length2);
}

const swapExactInputSingle = async (acc, proxy, tokenIn, tokenOut, fee, recipient, amountIn, amountOutMinimum, sqrtPriceLimitX96, from) => {
  console.log("Run to swapExactInputSingle");

  const createPoolAction = new Action(
    "PancakeSwapV3",
    process.env.PANCAKE_SWAP_V3_ADDRESS,
    ["address", "address", "uint24", "address", "uint256", "uint256", "uint160", "address"],
    [tokenIn, tokenOut, fee, recipient, amountIn, amountOutMinimum, sqrtPriceLimitX96, from]
  );

  console.log(tokenIn, tokenOut, fee, recipient, amountIn, amountOutMinimum, sqrtPriceLimitX96, from);
  const functionData = createPoolAction.encodeForDsProxyCall()[1];

  const createPoolContract = await getAddrFromRegistry("PancakeSwapV3");
  console.log(createPoolContract);

  const tokenA = (await hre.ethers.getContractAt("ERC20Mock", tokenIn));
  console.log("Before, balance token A of acc::", await tokenA.balanceOf(acc.address));

  let tx = await proxy["execute(address,bytes)"](
    createPoolContract,
    functionData, {
      gasLimit: 10000000,
    }
  );
  tx = await tx.wait();
  console.log("tx hash::", tx.transactionHash);

  console.log("After, balance token A of acc::", await tokenA.balanceOf(acc.address));
}

const combinatorPancakeswap = async (owner, proxy) => {
  let actionsCallData = [];
  let subData = [];
  let actionIds = [];

  // Tạo 2 token mới cho owner
  const tokenCInstance = await ethers.getContractFactory('ERC20Mock');
  const tokenC = await tokenCInstance.deploy("Token C", "TKC");
  await tokenC.deployed();
  const tokenCAddress = tokenC.address;
  console.log("Address ERC20Mock token C::", tokenCAddress);
  console.log("Balance tokenC of Owner::", await tokenC.balanceOf(owner.address));
  // const tokenC = (await hre.ethers.getContractFactory("ERC20Mock")).attach("0xA3AEda8F0D6fA18e25D2eE1ef8Efdb574e950318");
  // console.log("Balance token C of Owner::", await tokenC.balanceOf(owner.address));
  
  const tokenDInstance = await ethers.getContractFactory('ERC20Mock');
  const tokenD = await tokenDInstance.deploy("Token D", "TKD");
  await tokenD.deployed();
  const tokenDAddress = tokenD.address;
  console.log("Address ERC20Mock token D::", tokenDAddress);
  console.log("Balance token D of Owner::", await tokenD.balanceOf(owner.address));
  // const tokenD = (await hre.ethers.getContractFactory("ERC20Mock")).attach("0x0d6E52C84c893bc09F63Ef1605D8692054c926e3");
  // console.log("Balance token D of Owner::", await tokenD.balanceOf(owner.address));

  const [sorted1, sorted2] = [tokenC.address, tokenD.address].sort();
  
  // msg.sender là dsproxy khi gọi như này nên cần approve để nó pull nha
  await approve(tokenC.address, proxy.address);
  await approve(tokenD.address, proxy.address);
  
  // Owner tạo pool vói 2 token đó cung vào (145075268333520540069, 10000000000000000000)
  const createPoolAction = new Action(
    "PancakeCreatePoolV3",
    process.env.PANCAKE_CREATE_POOL_V3_ADDRESS,
    ["address", "address", "uint24", "int24", "int24", "uint256", "uint256", "uint256", "uint256", "address", "uint256", "address", "uint160"],
    [sorted1, sorted2, "2500", "-28150", "-26050", "145075268333520540069", "10000000000000000000", "0", "0", owner.address, "2688452425", owner.address, "20456476331960289157024907122"]
  );
  // Tăng thêm liquidity 1 lượng (2114810000000000, 1000000000000)
  const increaseLiquidityAction = new Action(
    "PancakeIncreaseLiquidityV3",
    process.env.PANCAKE_INCREASE_LIQUIDITY_V3_ADDRESS,
    ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256", "address"],
    ["0", "0", "0", "0", "0", "0", nullAddress]
  );
  // Swap 1000000000000000 token đầu đổi ra token còn lại
  const swapAction = new Action(
    "PancakeSwapV3",
    process.env.PANCAKE_SWAP_V3_ADDRESS,
    ["address", "address", "uint24", "address", "uint256", "uint256", "uint160", "address"],
    [sorted1, sorted2, "2500", owner.address, "1000000000000000", "0", "0", owner.address]
  );

  // Bỏ qua 2 action remove và collect vì gọi transfer from mà k gọi transfer
  // // Rút ra 1000 LP token
  // const removeLiquidityAction = new Action(
  //   "PancakeRemoveLiquidityV3",
  //   process.env.PANCAKE_REMOVE_LIQUIDITY_V3_ADDRESS,
  //   ["uint256", "uint128", "uint256", "uint256", "uint256"],
  //   ["0", "1000", "0", "0", "2688452425"]
  // );
  // // Collect toàn bộ token lãi có được
  // const collectTokenAction = new Action(
  //   "PancakeCollectV3",
  //   process.env.PANCAKE_COLLECT_V3_ADDRESS,
  //   ["uint256", "address", "uint128", "uint128"],
  //   ["0", owner.address, "1000000000000000000", "1000000000000000000"]
  // );
  
  const callDataCreatePool = createPoolAction.encodeForRecipe()[0];
  const callDataIncreaseLiquidity = increaseLiquidityAction.encodeForRecipe()[0];
  const swapToken = swapAction.encodeForRecipe()[0];
  // const removeLiquidity = removeLiquidityAction.encodeForRecipe()[0];
  // const collectToken = collectTokenAction.encodeForRecipe()[0];

  actionsCallData.push(callDataCreatePool);
  actionsCallData.push(callDataIncreaseLiquidity);
  actionsCallData.push(swapToken);
  // actionsCallData.push(removeLiquidity);
  // actionsCallData.push(collectToken);

  let paramMapping = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 128, 129, 130, 131, 132, 133],
    [0, 0, 0, 0, 0, 0, 0, 0],
    // [1, 0, 0, 0 ,0],
    // [1, 0, 0, 0]
  ];

  // Dùng kèm subdata cho vui chứ chả cần cũng được
  const subDataamount0DesiredIncreaseLiquidity = abiCoder.encode(["uint256"], ["2114810000000000"]);
  const subDataamount1DesiredIncreaseLiquidity = abiCoder.encode(["uint256"], ["1000000000000"]);
  const subDataamount0MinIncreaseLiquidity = abiCoder.encode(["uint256"], ["0"]);
  const subDataamount1MinIncreaseLiquidity = abiCoder.encode(["uint256"], ["0"]);
  const subDatadeadlineIncreaseLiquidity = abiCoder.encode(["uint256"], ["2688452425"]);
  const subDatafromIncreaseLiquidity = abiCoder.encode(["address"], [owner.address]);

  subData = [
    subDataamount0DesiredIncreaseLiquidity,
    subDataamount1DesiredIncreaseLiquidity,
    subDataamount0MinIncreaseLiquidity,
    subDataamount1MinIncreaseLiquidity,
    subDatadeadlineIncreaseLiquidity,
    subDatafromIncreaseLiquidity
  ];

  actionIds = [
    keccak256("PancakeCreatePoolV3").substr(0, 10),
    keccak256("PancakeIncreaseLiquidityV3").substr(0, 10),
    keccak256("PancakeSwapV3").substr(0, 10),
    // keccak256("PancakeRemoveLiquidityV3").substr(0, 10),
    // keccak256("PancakeCollectV3").substr(0, 10),
  ];

  console.log("actionsCallData", actionsCallData);
  console.log("subData", subData);
  console.log("actionIds", actionIds);
  console.log("paramMapping", paramMapping);

  const RecipeExecutorContract = await hre.ethers.getContractAt(
    "RecipeExecutor",
    process.env.RECIPE_EXECUTOR_ADDRESS
  );

  const calldata = RecipeExecutorContract.interface.encodeFunctionData(
    "executeRecipe",
    [
      {
        name: "PancakeSwapRecipe",
        callData: actionsCallData,
        subData: subData,
        actionIds: actionIds,
        paramMapping: paramMapping,
      },
    ]
  );

  let tx = await proxy["execute(address,bytes)"](
    RecipeExecutorContract.address,
    calldata,
    {
      gasLimit: 20000000,
    }
  );

  tx = await tx.wait();
  console.log("txHash", tx.transactionHash);

  console.log("After:: Balance token C of Owner::", await tokenC.balanceOf(owner.address));
  console.log("After:: Balance token D of Owner::", await tokenD.balanceOf(owner.address));
}

module.exports = {
  getProxy,
  addLiquidity,
  increaseLiquidity,
  createPool,
  collectLiquidity,
  removeLiquidity,
  swapExactTokenForToken,
  swapExactInputSingle,
  combinatorPancakeswap
}