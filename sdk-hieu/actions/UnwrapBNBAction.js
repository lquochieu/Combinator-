const { Action } = require("./Action");
const addresses = require("../address");

const nullAddress = "0x0000000000000000000000000000000000000000";

const getAction = (listParams) => {
  const action = new Action(
    "UnwrapBnb", 
    addresses.UNWRAP_BNB_ADDRESS, 
    ["uint256", "address"], 
    listParams ?? [0, nullAddress]
  );
  return action.encodeForRecipe()[0];
}

const getParamArray = (listParams) => {
  return [listParams?.amount ?? 0, listParams?.to ?? nullAddress];
}

const getFullListParams = (listParams) => {
  return [
    {
      amount: listParams?.amount ?? null,
      to: listParams?.to ?? null,
    },
    {
      amount: "uint256",
      to: "address"
    }
  ]
}

module.exports = {
  getAction,
  getParamArray,
  getFullListParams
};