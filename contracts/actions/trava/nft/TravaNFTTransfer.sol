// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../ActionBase.sol";
import "./helpers/TravaNFTHelper.sol";

contract TravaNFTTransfer is ActionBase, TravaNFTHelper {

    struct Params {
        address from;
        address to;
        uint256 tokenId;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        params.to = _parseParamAddr(
            params.to,
            _paramMapping[1],
            _subData,
            _returnValues
        );
        params.tokenId = _parseParamUint(
            params.tokenId,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        (uint256 tokenId, bytes memory logData) = _transfer(
            params.from,
            params.to,
            params.tokenId
        );
        emit ActionEvent("TravaNFTTransfer", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _transfer(
            params.from,
            params.to,
            params.tokenId
        );
        logger.logActionDirectEvent("TravaNFTTransfer", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal returns (uint256, bytes memory) {
        require(
            INFTCore(NFT_CORE).ownerOf(_tokenId) == _from,
            "Owner does not possess token"
        );

        INFTCore(NFT_CORE).transferFrom(_from, address(this), _tokenId);

        bytes memory logData = abi.encode(_from, _to, _tokenId);
        return (_tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
