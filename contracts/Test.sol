// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// import IERC20 oppenzeppelin-solidity/contracts/token/ERC20/IERC20.sol;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Test {

    IERC20 public token;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function transferToken(address _to, uint256 _amount) external {
        token.transferFrom(msg.sender,_to, _amount);
    }

    function setToken(address _token) external {
        token = IERC20(_token);
    }

    function getToken() external view returns (address) {
        return address(token);
    }

    function returnHehe() external pure returns (string memory) {
        return "hehe";
    }
}