// const helpers = require("@nomicfoundation/hardhat-network-helpers");
// const { ethers } = require('hardhat')
// const { expect, assert } = require('chai')

// describe('Test Helpers', function() {
//     describe('Mine', async function() {
//         it('should test the mine function', async function() {
//             // let latestBlock = await ethers.provider.getBlock("latest")
//             // console.log(latestBlock.number)
//             // let timestamp = Math.floor(Date.now() / 1000)
//             // await helpers.mine(); // Mine 1 bloc
//             // await helpers.mine(1000); // Mine 1000 blocs
//             // await helpers.mine(1000, { interval: 15 }); // Mine 1000 blocs avec un interval de temps entre de 15 secondes
//             // latestBlock = await ethers.provider.getBlock("latest")
//             // console.log(timestamp)
//             // console.log(latestBlock.number)
//             // console.log(latestBlock.timestamp)
//             // await helpers.mineUpTo(12345);
//             // latestBlock = await ethers.provider.getBlock("latest")
//             // console.log(latestBlock.number)
//         })

//         it('should test manipulating accounts functions', async function() {
//             // const [owner, addr1] = await ethers.getSigners()
//             // await helpers.setBalance(owner.address, 77);
//             // let balance = await ethers.provider.getBalance(owner.address)
//             // console.log(ethers.formatEther(balance.toString()))

//             // await helpers.setBalance(addr1.address, 10n * (10n ** 18n));
//             // balance = await ethers.provider.getBalance(addr1.address)
//             // console.log(ethers.formatEther(balance.toString()))
            
//             // await helpers.setBalance(addr1.address, 100n * (10n ** 18n));
//             // balance = await ethers.provider.getBalance(addr1.address)
//             // console.log(ethers.formatEther(balance.toString()))
//         })

//         it('should test the time manipulation helpers functions', async function() {
//             console.log(await helpers.time.latest())
//             console.log(await helpers.time.latestBlock())
//             // advance time by one hour and mine a new block
//             await helpers.time.increase(3600);
//             console.log(await helpers.time.latest())
//             console.log(await helpers.time.latestBlock())
//         })
        
//     })
// })