// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC205.sol";

interface IIERC20{
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract useERC20  {
    IERC20 interfaceToken;
    mapping(address => bool) isFromContract;

    modifier mustBeCreatedHere(address _addr) {
        require(isFromContract[_addr], "this token cant be transfered here");
        _;
    }

    function createToken(string calldata _name, string calldata symbol, uint initialSupply) external {
        address newToken = address(new MyToken(_name, symbol, initialSupply));
        isFromContract[newToken]=true;

    }

    function transferToken(address _addr, address _to, uint _amount) external mustBeCreatedHere(_addr){
        interfaceToken = IERC20(_addr);
        interfaceToken.transfer(_to, _amount);
    }

    function transferFromToken(address _addr, address _from, address _to, uint _amount) external mustBeCreatedHere(_addr){
        interfaceToken = IERC20(_addr);
        interfaceToken.transferFrom(_from, _to, _amount);
    }

}