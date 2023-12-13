// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Bank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        require(msg.value >= 0.001 ether, "Not enough Ethers");
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        require(balances[msg.sender] >= 0, "You have no ethers on the contract");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(balances[msg.sender]);
    }
}