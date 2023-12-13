// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract AlyraIsERC20 is ERC20, Ownable {

    uint256 private constant MAX_SUPPLY = 7777 * 10**18;

    constructor(address initialOwner)
        ERC20("Alyra", "ALY")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) external payable {
        require(totalSupply() + amount <= MAX_SUPPLY, "Not enough tokens");
        require(msg.value >= amount, "Not enough ether sent");
        _mint(to, amount);
    }
}