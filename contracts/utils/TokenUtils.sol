// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../interfaces/IWBNB.sol";
import "./SafeERC20.sol";

library TokenUtils {
    using SafeERC20 for IERC20;

    address public constant WSTBNB_ADDR =
        0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0;
    address public constant STBNB_ADDR =
        0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84;

    // address public constant WBNB_ADDR = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    // address public constant BNB_ADDR = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    address public constant WBNB_ADDR = 0x910CB19698Eac48a6AB7Ccc9542B756f2Bdd67C6;
    address public constant BNB_ADDR =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    function approveToken(
        address _tokenAddr,
        address _to,
        uint256 _amount
    ) internal {
        if (_tokenAddr == BNB_ADDR) return;

        if (IERC20(_tokenAddr).allowance(address(this), _to) < _amount) {
            IERC20(_tokenAddr).safeApprove(_to, _amount);
        }
    }

    function pullTokensIfNeeded(
        address _token,
        address _from,
        uint256 _amount
    ) internal returns (uint256) {
        // handle max uint amount
        if (_amount == type(uint256).max) {
            _amount = getBalance(_token, _from);
        }

        if (
            _from != address(0) &&
            _from != address(this) &&
            _token != BNB_ADDR &&
            _amount != 0
        ) {
            IERC20(_token).safeTransferFrom(_from, address(this), _amount);
        }

        return _amount;
    }

    function withdrawTokens(
        address _token,
        address _to,
        uint256 _amount
    ) internal returns (uint256) {
        if (_amount == type(uint256).max) {
            _amount = getBalance(_token, address(this));
        }

        if (_to != address(0) && _to != address(this) && _amount != 0) {
            if (_token != BNB_ADDR) {
                IERC20(_token).safeTransfer(_to, _amount);
            } else {
                (bool success, ) = _to.call{value: _amount}("");
                require(success, "Eth send fail");
            }
        }

        return _amount;
    }

    function depositWbnb(uint256 _amount) internal {
        IWBNB(WBNB_ADDR).deposit{value: _amount}();
    }

    function withdrawWbnb(uint256 _amount) internal {
        IWBNB(WBNB_ADDR).withdraw(_amount);
    }

    function getBalance(
        address _tokenAddr,
        address _acc
    ) internal view returns (uint256) {
        if (_tokenAddr == BNB_ADDR) {
            return _acc.balance;
        } else {
            return IERC20(_tokenAddr).balanceOf(_acc);
        }
    }

    function getTokenDecimals(address _token) internal view returns (uint256) {
        if (_token == BNB_ADDR) return 18;

        return IERC20(_token).decimals();
    }
}
