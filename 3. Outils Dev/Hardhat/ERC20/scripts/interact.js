const hre = require('hardhat')

async function main() {
    const signers = await hre.ethers.getSigners()
    
    const AlyraIsERC20 = await ethers.getContractFactory('AlyraIsERC20')
    const contract = AlyraIsERC20.attach(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    )

    // Mint
    let transaction = await contract.mint(signers[0].address, hre.ethers.parseEther('0.45'), { value: hre.ethers.parseEther('45')})
    await transaction.wait()

    // Balance
    let balance = await contract.balanceOf(signers[0].address)
    console.log(balance)

    // Transfer to signers[1].address
    transaction = await contract.transfer(signers[1].address, hre.ethers.parseEther('0.1'))
    await transaction.wait()

    // Balance
    balance = await contract.balanceOf(signers[1].address)
    console.log(balance)

    // Approve
    transaction = await contract.connect(signers[1]).approve(signers[2].address, hre.ethers.parseEther('0.05'))
    await transaction.wait()
    console.log('Approved...')
    
    // TransferFrom
    transaction = await contract.connect(signers[2]).transferFrom(signers[1].address, signers[3].address, hre.ethers.parseEther('0.05'))
    await transaction.wait()

    // Balance
    balance = await contract.balanceOf(signers[0].address)
    console.log('Balance account #0 : ' + balance)
    balance = await contract.balanceOf(signers[1].address)
    console.log('Balance account #1 : ' + balance)
    balance = await contract.balanceOf(signers[2].address)
    console.log('Balance account #2 : ' + balance)
    balance = await contract.balanceOf(signers[3].address)
    console.log('Balance account #3 : ' + balance)

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});