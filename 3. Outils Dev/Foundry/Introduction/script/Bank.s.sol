// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import { Bank } from "../src/Bank.sol";

contract MyScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(deployerPrivateKey);
        Bank bank = new Bank();
        vm.stopBroadcast();
    }
}