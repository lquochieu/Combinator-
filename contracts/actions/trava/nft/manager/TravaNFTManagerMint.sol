// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.4;

// import "../../../ActionBase.sol";
// import "../helpers/TravaNFTHelper.sol";
// import "../../../../utils/TokenUtils.sol";

// contract TravaNFTMint is ActionBase, TravaNFTHelper {
//     using TokenUtils for address;

//     struct Params {
//         address to;
//         uint256 option;
//     }

//     /// @inheritdoc ActionBase
//     function executeAction(
//         bytes memory _callData,
//         bytes32[] memory _subData,
//         uint8[] memory _paramMapping,
//         bytes32[] memory _returnValues
//     ) public payable virtual override returns (bytes32) {
//         Params memory params = parseInputs(_callData);

//         params.to = _parseParamAddr(
//             params.to,
//             _paramMapping[0],
//             _subData,
//             _returnValues
//         );

//         params.option = _parseParamUint(
//             params.option,
//             _paramMapping[1],
//             _subData,
//             _returnValues
//         );

//         (uint256 tokenId, bytes memory logData) = _mint(
//             params.to,
//             params.option
//         );
//         emit ActionEvent("TravaNFTMint", logData);
//         return bytes32(tokenId);
//     }

//     /// @inheritdoc ActionBase
//     function executeActionDirect(
//         bytes memory _callData
//     ) public payable override {
//         Params memory params = parseInputs(_callData);
//         (, bytes memory logData) = _mint(
//             params.to,
//             params.option
//         );
//         logger.logActionDirectEvent("TravaNFTMint", logData);
//     }

//     /// @inheritdoc ActionBase
//     function actionType() public pure virtual override returns (uint8) {
//         return uint8(ActionType.STANDARD_ACTION);
//     }

//     //////////////////////////// ACTION LOGIC ////////////////////////////

//     function _mint(
//         address _to,
//         uint256 _option
//     ) internal returns (uint256, bytes memory) {
        

//         bytes memory logData = abi.encode(_tokenId, _from);
//         return (_tokenId, logData);
//     }

//     function parseInputs(
//         bytes memory _callData
//     ) public pure returns (Params memory params) {
//         params = abi.decode(_callData, (Params));
//     }
// }
