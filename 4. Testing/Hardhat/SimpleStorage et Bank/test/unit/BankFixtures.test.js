// const {
//     loadFixture,
// } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { ethers } = require('hardhat')
// const { expect, assert } = require('chai')

// async function deployBankFixture() {
//     [owner, addr1, addr2] = await ethers.getSigners()
//     let contract = await ethers.getContractFactory('Bank')
//     bank = await contract.deploy()
//     return { bank, owner, addr1, addr2 };
// }

// async function deployBankWithDepositFixture() {
//     [owner, addr1, addr2] = await ethers.getSigners()
//     let contract = await ethers.getContractFactory('Bank')
//     bank = await contract.deploy()

//     let etherQuantity = ethers.parseEther('0.1')
//     let transaction = await bank.deposit({ value: etherQuantity })
//     await transaction.wait()

//     return { bank, owner, addr1, addr2 };
// }

// describe('Test Bank contract', function() {

//     describe('Initialization', function() {
//         it('should deploy the smart contract', async function() {
//             let { bank, owner, addr1, addr2 } = await loadFixture(deployBankFixture)
//             let theOwner = await bank.owner()
//             assert.equal(owner.address, theOwner)
//         })
//     })

//     describe('Deposit', function() {
//         it('should NOT deposit Ethers on the Bank smart contract if not the owner', async function() {
//             let { bank, owner, addr1, addr2 } = await loadFixture(deployBankFixture)
//             let etherQuantity = ethers.parseEther('0.1')
//             await expect(bank.connect(addr1).deposit({ value: etherQuantity })).to.be.revertedWithCustomError(
//                 bank,
//                 "OwnableUnauthorizedAccount"
//             ).withArgs(
//                 addr1.address
//             )
//         })

//         it('should NOT deposit Ethers if not enough funds provided', async function() {
//             let { bank, owner, addr1, addr2 } = await loadFixture(deployBankFixture)
//             let etherQuantity = ethers.parseEther('0.09')
//             await expect(bank.deposit({ value: etherQuantity })).to.be.revertedWith('not enough funds provided')
//         })

//         it('should deposit Ethers if Owner and if enough funds provided', async function() {
//             let { bank, owner, addr1, addr2 } = await loadFixture(deployBankFixture)
//             let etherQuantity = ethers.parseEther('0.1') 
//             await expect(bank.deposit({ value: etherQuantity }))
//             .to.emit(
//                 bank,
//                 'Deposit'
//             )
//             .withArgs(
//                 owner.address,
//                 etherQuantity
//             )
//             let balance = await ethers.provider.getBalance(bank.target)
//             assert(balance.toString() === "100000000000000000")
//         })
//     })

//     describe('Withdraw', function() {
//         it('should NOT withdraw if NOT the owner', async function() {
//             let { bank, owner, addr1, addr2 } = await loadFixture(deployBankWithDepositFixture)
//             let etherQuantity = ethers.parseEther('0.1')
//             await expect(bank.connect(addr1).withdraw(etherQuantity)).to.be.revertedWithCustomError(
//                 bank,
//                 "OwnableUnauthorizedAccount"
//             ).withArgs(
//                 addr1.address
//             )
//         })

//         it('should NOT withdraw if the owner try to withdraw too many ethers', async function() {
//             let { bank, owner, addr1, addr2 } = await loadFixture(deployBankWithDepositFixture)
//             let etherQuantity = ethers.parseEther('0.2')
//             await expect(bank.withdraw(etherQuantity)).to.be.revertedWith('you cannot withdraw this amount')
//         })

//         it('should withdraw if the owner try to withdraw and the amount is correct', async function() {
//             let { bank, owner, addr1, addr2 } = await loadFixture(deployBankWithDepositFixture)
//             let etherQuantity = ethers.parseEther('0.05')
//             await expect(bank.withdraw(etherQuantity))
//             .to.emit(
//                 bank,
//                 'Withdraw'
//             )
//             .withArgs(
//                 owner.address,
//                 etherQuantity
//             )
//             let balance = await ethers.provider.getBalance(bank.target)
//             assert(balance.toString() === "50000000000000000")
//         })
//     })
// })