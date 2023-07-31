const actionsList = require("./actions");
const addresses = require("./address");
const { keccak256 } = require('web3-utils');
const abiCoder = new hre.ethers.utils.AbiCoder();

function getAction(actionName, listParamsArray) {
  return actionsList[actionName].getAction(listParamsArray);
}

function getListParams(actionName, listParam) {
  return actionsList[actionName].getParamArray(listParam);
}

function getFullListParams(actionName, listParam) {
  return actionsList[actionName].getFullListParams(listParam);
}

async function executeRecipes(proxy, listActions, listParams, options) {
  let actionsCallData = [];
  let actionIds = [];
  let subData = [];
  let paramMapping = [];
  for(let i = 0; i < listActions.length; i++){
    let listParamsArray = getListParams(listActions[i], listParams[i]);
    actionsCallData.push(getAction(listActions[i], listParamsArray));
    actionIds.push(keccak256(listActions[i]).substr(0, 10));
    paramMapping.push([]);
    listParamsArray = listParamsArray.flat();
    for(let j = 0; j < listParamsArray.length; j++){
      if(listParamsArray[j].toString().startsWith("&")){
        paramMapping[i].push(parseInt(listParamsArray[j].substring(1)));
      } else {
        paramMapping[i].push(0);
      }
    }
  }
  return await execute(proxy, actionsCallData, subData, actionIds, paramMapping, options);
}

async function execute(proxy, actionsCallData, subData, actionIds, paramMapping, options) {
  const RecipeExecutorContract = await hre.ethers.getContractAt(
    "RecipeExecutor",
    addresses.RECIPE_EXECUTOR_ADDRESS
  );
  const calldata = RecipeExecutorContract.interface.encodeFunctionData(
    "executeRecipe",
    [
      {
        name: "Recipe",
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
      gasPrice: options?.gasPrice ?? 1000000000,
      gasLimit: options?.gasLimit ?? 20000000,
      value: options?.value ? options.value : undefined
    }
  );
  return tx;
}

function getRecipe(listActions, listParams) {
  let actionsCallData = [];
  let actionIds = [];
  let paramMapping = [];
  let countParamMapping = 128;
  let additionalParams = [];
  let additionalType = [];
  for(let i = 0; i < listActions.length; i++){
    let listParamsArray = getListParams(listActions[i], listParams[i]);
    const fullListParam = getFullListParams(listActions[i], listParams[i])
    additionalParams.push(fullListParam[0]);
    additionalType.push(fullListParam[1]);
    actionsCallData.push(getAction(listActions[i], listParamsArray));
    actionIds.push(keccak256(listActions[i]).substr(0, 10));
    paramMapping.push([]);
    listParamsArray = listParamsArray.flat();
    for(let j = 0; j < listParamsArray.length; j++){
      if(fullListParam[j] == null) {
        paramMapping[i].push(countParamMapping);
        countParamMapping++;
      } else if(listParamsArray[j].toString().startsWith("&")){
        paramMapping[i].push(parseInt(listParamsArray[j].substring(1)));
      } else {
        paramMapping[i].push(0);
      }
    }
  }
  return {
    actionsCallData, 
    actionIds,
    paramMapping,
    listActions,
    additionalParams,
    additionalType
  }
}

function traverseWhenNullInFirst(arr1, arr2, arr3) {
  const subData = [];
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must have the same length.');
  }
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];
    const obj3 = arr3[i];
    for (const key in obj1) {
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key) && obj3.hasOwnProperty(key)) {
        const value1 = obj1[key];
        const value2 = obj2[key];
        const value3 = obj3[key];
        if (value1 === null && value2 !== null && value3 !== null) {
          subData.push(abiCoder.encode([value3], [value2]));
        }
      }
    }
  }
  return subData;
}

async function executeExistRecipe(proxy, {actionsCallData, actionIds, paramMapping, additionalParams, additionalType}, newParam, options) {
  const subData = traverseWhenNullInFirst(additionalParams, newParam, additionalType);
  return await execute(proxy, actionsCallData, subData, actionIds, paramMapping, options);
}

function getApproveList(listActions, listParams) {
  let returnValue = [];
  for(let i = 0; i < listActions.length; i++){
    switch(listActions[i]){
      case "WrapBNB": 
        returnValue.push(null);
        break;
      case "UnwrapBNB": 
        returnValue.push(null);
        break;
      default:
        returnValue.push(null);
    }
  }
  // Nếu có sẽ return {type: <approveNFT hay token>, address: <addresstoken or NFT>}
}

module.exports = {
  executeRecipes,
  getApproveList,
  getRecipe,
  executeExistRecipe
};