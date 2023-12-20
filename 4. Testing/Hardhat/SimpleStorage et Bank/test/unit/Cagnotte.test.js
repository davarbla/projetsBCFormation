const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require('hardhat')
const { expect, assert } = require('chai')

async function deployCagnotteFixture() {
    [owner, addr1, addr2, addr3] = await ethers.getSigners()
    let goal = ethers.parseEther('5')
    let contract = await ethers.getContractFactory('Cagnotte')
    cagnotte = await contract.deploy(goal)
    return { cagnotte, goal, owner, addr1, addr2, addr3 };
}

async function deployCagnotteWithDepositsButNotEnoughFixture() {
    [owner, addr1, addr2, addr3] = await ethers.getSigners()

    let goal = ethers.parseEther('5')
    let contract = await ethers.getContractFactory('Cagnotte')
    cagnotte = await contract.deploy(goal)

    let etherQuantity = ethers.parseEther('1')
    await cagnotte.connect(addr1).deposit({ value: etherQuantity })

    etherQuantity = ethers.parseEther('2')
    await cagnotte.connect(addr2).deposit({ value: etherQuantity })

    return { cagnotte, goal, owner, addr1, addr2, addr3 };
}

async function deployCagnotteWithDepositsEnoughGoalFixture() {
    [owner, addr1, addr2, addr3] = await ethers.getSigners()
    
    let goal = ethers.parseEther('5')
    let contract = await ethers.getContractFactory('Cagnotte')
    cagnotte = await contract.deploy(goal)

    let etherQuantity = ethers.parseEther('1')
    await cagnotte.connect(addr1).deposit({ value: etherQuantity })

    etherQuantity = ethers.parseEther('2')
    await cagnotte.connect(addr2).deposit({ value: etherQuantity })

    etherQuantity = ethers.parseEther('4')
    await cagnotte.connect(addr3).deposit({ value: etherQuantity })

    return { cagnotte, goal, owner, addr1, addr2, addr3 };
}

describe('Test Bank contract', function() {

    describe('Initialization', function() {
        it('should NOT deploy the smart contract if the goal is 0', async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners()
            let goal = ethers.parseEther('0')
            let contract = await ethers.getContractFactory('Cagnotte')
            await expect(contract.deploy(goal)).to.be.revertedWith('Goal must be greater than 0')
        })

        it('should deploy the smart contract', async function() {
            let { cagnotte, goal, owner, addr1, addr2, addr3 } = await loadFixture(deployCagnotteFixture)
            let theOwner = await cagnotte.owner()
            assert.equal(owner.address, theOwner)
            let theGoal = await cagnotte.goal()
            assert.equal(goal.toString(), theGoal.toString())
        })
    })

    describe('Deposit', function() {
        it('should NOT deposit Ethers on the Cagnotte smart contract if not enough funds provided', async function() {
            let { cagnotte, goal, owner, addr1, addr2, addr3 } = await loadFixture(deployCagnotteFixture)
            let etherQuantity = ethers.parseEther('0')
            await expect(cagnotte.deposit({ value: etherQuantity })).to.be.revertedWith('Deposit must be greater than 0')
        })

        it('should deposit Ethers on the Cagnotte smart contract if enough funds are provided', async function() {
            let { cagnotte, goal, owner, addr1, addr2, addr3 } = await loadFixture(deployCagnotteFixture)
            let etherQuantity = ethers.parseEther('1')
            await cagnotte.connect(addr1).deposit({ value: etherQuantity })

            let givenAddr1 = await cagnotte.given(addr1.address)
            assert(givenAddr1.toString() === etherQuantity.toString())

            etherQuantity = ethers.parseEther('2')
            await cagnotte.connect(addr2).deposit({ value: etherQuantity })
            
            let givenAddr2 = await cagnotte.given(addr2.address)
            assert(givenAddr2.toString() === etherQuantity.toString())

            let contractBalance = await ethers.provider.getBalance(cagnotte.target)
            let threeEthers = ethers.parseEther('3')
            assert(contractBalance.toString() === threeEthers.toString())
        })

        it('should deposit Ethers on the Cagnotte smart contract if enough funds are provided and emit an event', async function() {
            let { cagnotte, goal, owner, addr1, addr2, addr3 } = await loadFixture(deployCagnotteFixture)
            let etherQuantity = ethers.parseEther('1')
            await expect(cagnotte.deposit({ value: etherQuantity }))
            .to.emit(
                cagnotte,
                'Deposit'
            )
            .withArgs(
                owner.address,
                etherQuantity
            )
        })
    })

    describe('Withdraw', function() {
        it('should NOT withdraw if NOT the owner', async function() {
            let { cagnotte, goal, owner, addr1, addr2, addr3 } = await loadFixture(deployCagnotteWithDepositsButNotEnoughFixture)

            await expect(cagnotte.connect(addr1).withdraw()).to.be.revertedWithCustomError(
                cagnotte,
                "OwnableUnauthorizedAccount"
            ).withArgs(
                addr1.address
            )
        })

        it('should NOT withdraw if the goal is NOT reached', async function() {
            let { cagnotte, goal, owner, addr1, addr2, addr3 } = await loadFixture(deployCagnotteWithDepositsButNotEnoughFixture)

            await expect(cagnotte.withdraw()).to.be.revertedWith('Goal not reached')
        })

        it('should withdraw if the goal is reached', async function() {
            let { cagnotte, goal, owner, addr1, addr2, addr3 } = await loadFixture(deployCagnotteWithDepositsEnoughGoalFixture)
            let ownerBalanceBeforeWithdraw = await ethers.provider.getBalance(owner.address)
            let contractBalance = await ethers.provider.getBalance(cagnotte.target)

            await expect(cagnotte.withdraw())
            .to.emit(
                cagnotte,
                'Withdrawal'
            )
            .withArgs(
                owner.address,
                contractBalance
            )

            let ownerBalanceAfterWithdraw = await ethers.provider.getBalance(owner.address)
            expect(ownerBalanceAfterWithdraw).to.be.gt(ownerBalanceBeforeWithdraw)
        })
    })  
})