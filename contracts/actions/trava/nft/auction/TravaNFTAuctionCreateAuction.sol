// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../ActionBase.sol";
import "./helpers/TravaNFTAuctionHelper.sol";

contract TravaNFTAuctionCreateAuction is ActionBase, TravaNFTAuctionHelper {
    struct Params {
        uint256 tokenId;
        uint256 startingBid;
        uint256 duration;
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

        params.duration = _parseParamUint(
            params.duration,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[2],
            _subData,
            _returnValues
        );

        (uint256 tokenId, bytes memory logData) = _createAuction(
            params.tokenId,
            params.startingBid,
            params.duration,
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
            params.duration,
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
        uint256 _duration,
        address _from
    ) internal returns (uint256, bytes memory) {
        if (_from == address(0)) {
            _from = address(this);
        }

        require(
            INFTCore(NFT_COLLECTION).ownerOf(_tokenId) == _from,
            "Owner does not possess token"
        );

        INFTCore(NFT_COLLECTION).transferFrom(_from, address(this), _tokenId);

        INFTCore(NFT_COLLECTION).approve(NFT_AUCTION, _tokenId);
        // this part is not working . then need approve for sell contract
        INFTAuction(NFT_AUCTION).createAuction(_tokenId, _startingBid, _duration);
       
        bytes memory logData = abi.encode(_tokenId, _startingBid, _duration, _from);

        return (_tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
