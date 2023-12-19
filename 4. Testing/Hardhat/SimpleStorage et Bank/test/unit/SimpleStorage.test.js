const { ethers } = require('hardhat')
const { expect, assert } = require('chai')

describe('Test SimpleStorage contract', function() {
    let deployedContract

    beforeEach(async function() {
        let contract = await ethers.getContractFactory('SimpleStorage')
        deployedContract = await contract.deploy()
    })

    describe('Initialization', function() {
        it('should get the number and the number should be equal to 0', async function() {
            let number = await deployedContract.getNumber()
            assert(number.toString() === "0")
            // assert.equal(number.toString(), "0")
            expect(number.toString()).to.equal("0");
        })
    })

    describe('Set and Get', function() {
        it('should set the number and get an updated number', async function() {
            let transaction = await deployedContract.setNumber(7)
            await transaction.wait()
            let number = await deployedContract.getNumber()
            assert(number.toString() === "7")
        })
    })
})