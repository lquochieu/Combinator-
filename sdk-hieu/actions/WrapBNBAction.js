const { Action } = require("./Action");
const addresses = require("../address");

const getAction = (listParam) => {
  const action = new Action(
    "WrapBnb", 
    addresses.WRAP_BNB_ADDRESS, 
    ["uint256"], 
    listParam ?? [0]
  );
  return action.encodeForRecipe()[0];
}
const getParamArray = (listParam) => {
  return [listParam?.amount ?? 0];
}

const getFullListParams = (listParams) => {
  return [
    {
      amount: listParams?.amount ?? null,
    },
    {
      amount: "uint256"
    }
  ]
}

module.exports = {
  getAction,
  getParamArray,
  getFullListParams
};