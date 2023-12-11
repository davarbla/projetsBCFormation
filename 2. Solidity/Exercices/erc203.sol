// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IIERC20{
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract useERC20  {
    IERC20 interfaceToken;

    constructor(address _addr) {
        interfaceToken=IERC20(_addr);
    }

    function transferToken(address _to, uint _amount) external {
        interfaceToken.transfer(_to, _amount);
    }

    function transferFromToken(address _from, address _to, uint _amount) external {
        interfaceToken.transferFrom(_from, _to, _amount);
    }

}