// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../auth/AdminAuth.sol";
import "../interfaces/ITrigger.sol";

// User gọi wrap BNB thì khoản BNB mà họ có phải > 0 và <= giá trị họ muốn wrap
contract BNBBalanceTrigger is ITrigger, AdminAuth {

  struct SubParams {
    address userSmartWallet;
    uint amount;
  }

  constructor(address _libAddressManager) AdminAuth(_libAddressManager) {}
  function isTriggered(bytes memory, bytes memory _subData)
      public
      view
      override
      returns (bool)
  {   
      SubParams memory triggerSubData = parseInputs(_subData);
      uint userBalance = address(triggerSubData.userSmartWallet).balance;
      if(userBalance > 0 && userBalance >= triggerSubData.amount){
        return true;
      }
      return false;
  }

  function parseInputs(bytes memory _subData) internal pure returns (SubParams memory params) {
      params = abi.decode(_subData, (SubParams));
  }
  function changedSubData(bytes memory _subData) public pure override  returns (bytes memory) {
  }
  
  function isChangeable() public pure override returns (bool){
    return false;
  }
}
