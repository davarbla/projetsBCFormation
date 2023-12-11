// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IIERC20{
    function transfer(address to, uint256 value) external returns (bool);
}

contract useERC20  {
    IERC20 interfaceToken;

    constructor(address _addr) {
        interfaceToken=IERC20(_addr);
    }

    function transferToken(address _to, uint _amount) external {
        interfaceToken.transfer(_to, _amount);
    }


}