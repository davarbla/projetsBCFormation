const hre = require('hardhat')

async function main() {
    const signers = await hre.ethers.getSigners()
    
    const Bank = await ethers.getContractFactory('Bank')
    const contract = Bank.attach(
      "0x1aC038deC03c24e8fD361eA0C91AfcB8B5158395"
    )

    let depositTransaction = await contract.sendEthers({
        value: hre.ethers.parseEther('0.01')
    })
    await depositTransaction.wait()
    console.log('Ethers sent...')

    console.log(signers[0].address)
    let balance = await contract.getBalance(signers[0].address)
    console.log(`Amount on the smart contract : ${hre.ethers.formatEther(balance)}`)

    console.log('Withdrawing...');
    let withdrawTransaction = await contract.withdraw(balance);
    await withdrawTransaction.wait();

    balance = await contract.getBalance(signers[0].address)
    console.log(`Amount on the smart contract : ${hre.ethers.formatEther(balance)}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
  