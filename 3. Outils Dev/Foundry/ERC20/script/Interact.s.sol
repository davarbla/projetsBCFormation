// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import { IAlyraIsERC20 } from '../src/interfaces/IAlyraIsERC20.sol';

contract Interact is Script {
    IAlyraIsERC20 _deployedContract;
    address ALY_ADDRESS = 0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35;

    address signer0 = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address signer1 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address signer2 = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    address signer3 = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;

    function run() external {
        
        // Accessing to already deployed contract with his address
        _deployedContract = IAlyraIsERC20(ALY_ADDRESS);

        uint256 amountToMint = 0.45 ether;
        _deployedContract.mint{value: amountToMint}(signer0, amountToMint);

        uint256 balance = _deployedContract.balanceOf(signer0);
        console.log(balance);

        vm.prank(signer0);
        _deployedContract.transfer(signer1, 0.1 ether);
        console.log('transfer...');
        
        balance = _deployedContract.balanceOf(signer1);
        console.log(balance);

        vm.prank(signer1);
        _deployedContract.approve(signer2, 0.05 ether);
        console.log('approved...');

        vm.prank(signer2);
        _deployedContract.transferFrom(signer1, signer3, 0.05 ether);
        console.log('transferFromED');

        console.log('Balances...');
        balance = _deployedContract.balanceOf(signer0);
        console.log(balance);
        balance = _deployedContract.balanceOf(signer1);
        console.log(balance);
        balance = _deployedContract.balanceOf(signer2);
        console.log(balance);
        balance = _deployedContract.balanceOf(signer3);
        console.log(balance);

                
    }
}