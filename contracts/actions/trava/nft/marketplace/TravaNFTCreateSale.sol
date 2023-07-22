// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "../helpers/TravaNFTHelper.sol";

contract TravaNFTCreateSale is ActionBase, TravaNFTHelper {

    struct Params {
        uint256 tokenId;
        uint256 price;
        address from;
    }

    /// @inheritdoc ActionBase
    function executeAction(
        bytes memory _callData,
        bytes32[] memory _subData,
        uint8[] memory _paramMapping,
        bytes32[] memory _returnValues
    ) public payable virtual override returns (bytes32) {
        Params memory params = parseInputs(_callData);

        params.tokenId = _parseParamUint(
            params.tokenId,
            _paramMapping[0],
            _subData,
            _returnValues
        );
        params.price = _parseParamUint(
            params.price,
            _paramMapping[1],
            _subData,
            _returnValues
        );
        params.from = _parseParamAddr(
            params.from,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        (uint256 tokenId, bytes memory logData) = _createSale(
            params.tokenId,
            params.price,
            params.from
        );
        emit ActionEvent("TravaNFTCreateSale", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _createSale(
            params.tokenId,
            params.price,
            params.from
        );
        logger.logActionDirectEvent("TravaNFTCreateSale", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _createSale(
        uint256 _tokenId,
        uint256 _price,
        address _from
    ) internal returns (uint256, bytes memory) {
        require(
            INFTCore(NFT_CORE).ownerOf(_tokenId) == _from,
            "Owner does not possess token"
        );

        INFTCore(NFT_CORE).transferFrom(_from, address(this), _tokenId);
        
        INFTCore(NFT_CORE).approve(NFT_MARKETPLACE, _tokenId);
        // this part is not working . then need approve for sell contract
        IMarketplace(NFT_MARKETPLACE).createSale(_tokenId, _price);


        bytes memory logData = abi.encode(_tokenId, _price, _from);
        return (_tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
