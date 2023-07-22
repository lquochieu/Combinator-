// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../../utils/TokenUtils.sol";
import "../../../ActionBase.sol";
import "./helpers/TravaNFTAuctionHelper.sol";

contract TravaNFTAuctionMakeBid is ActionBase, TravaNFTAuctionHelper {
    using TokenUtils for address;
    
    struct Params {
        uint256 tokenId;
        uint256 bidPrice;
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
        params.bidPrice = _parseParamUint(
            params.bidPrice,
            _paramMapping[1],
            _subData,
            _returnValues
        );

        params.from = _parseParamAddr(
            params.from,
            _paramMapping[3],
            _subData,
            _returnValues
        );

        (uint256 tokenId, bytes memory logData) = _makeBid(
            params.tokenId,
            params.bidPrice,
            params.from
        );
        emit ActionEvent("TravaNFTAuctionMakeBid", logData);
        return bytes32(tokenId);
    }

    /// @inheritdoc ActionBase
    function executeActionDirect(
        bytes memory _callData
    ) public payable override {
        Params memory params = parseInputs(_callData);
        (, bytes memory logData) = _makeBid(
            params.tokenId,
            params.bidPrice,
            params.from
        );
        logger.logActionDirectEvent("TravaNFTAuctionMakeBid", logData);
    }

    /// @inheritdoc ActionBase
    function actionType() public pure virtual override returns (uint8) {
        return uint8(ActionType.STANDARD_ACTION);
    }

    //////////////////////////// ACTION LOGIC ////////////////////////////

    function _makeBid(
        uint256 _tokenId,
        uint256 _bidPrice,
        address _from
    ) internal returns (uint256, bytes memory) {
        if (_from == address(0)) {
            _from = address(this);
        }

        // pull tokens to proxy so we can supply
        PAYMENT_GOVERNOR.pullTokensIfNeeded(_from, _bidPrice);

        // this part is not working . then need approve for sell contract
        INFTAuction(NFT_AUCTION).makeBid(_tokenId, _bidPrice);
       
        bytes memory logData = abi.encode(_tokenId, _bidPrice, _from);

        return (_tokenId, logData);
    }

    function parseInputs(
        bytes memory _callData
    ) public pure returns (Params memory params) {
        params = abi.decode(_callData, (Params));
    }
}
