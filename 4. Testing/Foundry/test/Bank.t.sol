// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import "forge-std/Test.sol";
import { Bank } from "../src/Bank.sol";

contract BankTest is Test {
    
    address owner = makeAddr("User0");
    address addr1 = makeAddr("User1");

    Bank bank;
    
    function setUp() public {
        vm.prank(owner);
        bank = new Bank();
    }

    function test_OwnerIsUser0() public {
        address _owner = bank.owner();
        assertEq(owner, _owner);
    }

    // Deposit
    function test_RevertWhen_DepositNotTheOwner() public {
        bytes4 selector = bytes4(keccak256("OwnableUnauthorizedAccount(address)"));
        vm.expectRevert(abi.encodeWithSelector(selector, addr1));
        vm.prank(addr1);
        vm.deal(addr1, 10 ether);
        bank.deposit{value: 5 ether}();
    }

    function test_RevertWhen_DepositNotEnoughEtherProvided() public {
        vm.expectRevert("not enough funds provided");
        vm.prank(owner);
        vm.deal(owner, 10 ether);
        bank.deposit{value: 0.005 ether}();
    }

    function test_ExpectEmit_SuccessfullDeposit() public {
        uint256 deposit = 0.1 ether;

        vm.expectEmit(true, false, false, true);
        emit Bank.Deposit(address(owner), deposit);

        vm.prank(owner);
        vm.deal(owner, 10 ether);
        bank.deposit{value: 0.1 ether}();
    }

    // Withdraw
    function helperDeposit() public {
        vm.prank(owner);
        vm.deal(owner, 10 ether);
        bank.deposit{value: 0.1 ether}();
    }

    function test_RevertWhen_WithdrawNotTheOwner() public {
        helperDeposit();

        bytes4 selector = bytes4(keccak256("OwnableUnauthorizedAccount(address)"));
        vm.expectRevert(abi.encodeWithSelector(selector, addr1));

        uint256 amountToWithdraw = 0.1 ether;

        vm.prank(addr1);
        vm.deal(addr1, 10 ether);
        
        bank.withdraw(amountToWithdraw);
    }

    function test_RevertWhen_WithdrawCannotWithdrawTooMuch() public {
        helperDeposit();
        uint256 amountToWithdraw = 0.2 ether;
        vm.expectRevert("you cannot withdraw this amount");
        vm.prank(owner);
        vm.deal(owner, 10 ether);
        bank.withdraw(amountToWithdraw);
    }

    function test_ExpectEmit_SuccessfullWithdraw() public {
        helperDeposit();
        uint256 amountToWithdraw = 0.1 ether;
        vm.expectEmit(true, false, false, true);
        emit Bank.Withdraw(address(owner), amountToWithdraw);
        vm.prank(owner);
        bank.withdraw(amountToWithdraw);

        uint256 contractBalance = address(bank).balance;
        assertEq(contractBalance, 0);
    }

    function test_RevertWhen_ContractCallerHasNoReceiveFallback() public {
        bank = new Bank();
        bank.deposit{value: 0.1 ether}();
        vm.expectRevert("the withdraw did not work");
        bank.withdraw(0.1 ether);
    }
}