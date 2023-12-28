# Alyra - Cancun Promo - Project 2 : Voting Test

##Presentation

This project is based on the Voting contract provided by Alyra that manages a voting system.
The aim of this project is to test the voting contract.
The objective is to cover all the functionnalities of the contract with unit tests.

##Organization of the tests

The voting tests is divided into 7 stages:

   1.INITIALIZATION
   2.REGISTER VOTERS
   3.START PROPOSALS REGISTRATION
   4.END PROPOSALS REGISTERING
   5.START VOTING SESSION
   6.END VOTING SESSION
   7.TALLY VOTES

Usually, for every stage, it checks first that the normal use case works fine.
Then, it checks situations unallowed that must revert. 
It is intented to check only one condition by each test if suitable.
Each stage context is initialized by the beforeEach() function.

There are 3 kinds of users profile: owner, voter and  unregistered user.

##Coverage

45 tests passing
All functions has been tested
100% coverage

```bash
-------------|----------|----------|----------|----------|----------------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------|----------|----------|----------|----------|----------------|
 contracts\  |      100 |      100 |      100 |      100 |                |
  Voting.sol |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|
All files    |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|
```