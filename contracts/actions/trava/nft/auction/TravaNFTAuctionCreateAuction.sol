// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "./helpers/TravaNFTAuctionHelper.sol";

contract TravaNFTAuctionCreateAuction is ActionBase, TravaNFTAuctionHelper {
    struct Params {
        uint256 tokenId;
        uint256 startingBid;
        uint256 cellingPrice;
        uint256 endTime;
        uint256 method;
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
        params.startingBid = _parseParamUint(
            params.startingBid,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.cellingPrice = _parseParamUint(
            params.cellingPrice,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        params.endTime = _parseParamUint(
            params.endTime,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        params.method = _parseParamUint(
            params.method,
            _paramMapping[4],
            _subData,
            _returnValues
        );

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[5],
            _subData,
            _returnValues
        );

        (uint256 tokenId, bytes memory logData) = _createAuction(
            params.tokenId,
            params.startingBid,
            params.cellingPrice,
            params.endTime,
            params.method,
            params.from
        );
        emit ActionEvent("TravaNFTAuctionCreateAuction", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _createAuction(
            params.tokenId,
            params.startingBid,
            params.cellingPrice,
            params.endTime,
            params.method,
            params.from
        );
        logger.logActionDirectEvent("TravaNFTAuctionCreateAuction", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _createAuction(
        uint256 _tokenId,
        uint256 _startingBid,
        uint256 _ceilingPrice,
        uint256 _endTime,
        uint256 _method,
        address _from
    ) internal returns (uint256, bytes memory) {
        if (_from == address(0)) {
            _from = address(this);
        }

        require(
            INFTCore(NFT_COLLECTION).ownerOf(_tokenId) == _from,
            "Owner does not possess token"
        );

        if(_from != address(this)) {
            INFTCore(NFT_COLLECTION).transferFrom(_from, address(this), _tokenId);
        }

        INFTCore(NFT_COLLECTION).approve(NFT_AUCTION, _tokenId);
        // this part is not working . then need approve for sell contract
        INFTAuctionWithProposal(NFT_AUCTION).createAuction(
            _tokenId,
            _startingBid,
            _ceilingPrice,
            _endTime,
            _method
        );

        bytes memory logData = abi.encode(
            _tokenId,
            _startingBid,
            _ceilingPrice,
            _endTime,
            _method,
            _from
        );

        return (_tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
