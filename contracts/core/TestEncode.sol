// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;


contract TestEncode { 

  struct Recipe {
        string name;
        bytes[] callData;
        bytes32[] subData;
        bytes4[] actionIds;
        uint8[][] paramMapping;
    }

    function _executeAction(
        Recipe memory _currRecipe,
        uint256 _index,
        bytes32[] memory _returnValues
    ) public view returns (bytes memory ) {

          return  abi.encodeWithSignature(
                "executeAction(bytes,bytes32[],uint8[],bytes32[])",
                _currRecipe.callData[_index],
                _currRecipe.subData,
                _currRecipe.paramMapping[_index],
                _returnValues
            );
        
    }
}