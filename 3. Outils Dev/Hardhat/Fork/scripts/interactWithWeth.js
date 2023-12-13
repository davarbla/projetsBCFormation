const hre = require("hardhat");

async function main() {
    const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    // getContractAt 
    const Weth = await hre.ethers.getContractAt("IWETH", WETH_ADDRESS)

    const impersonatedSigner = await ethers.getImpersonatedSigner("0x1234567890123456789012345678901234567890")

    let balanceOfUser = await Weth.balanceOf("0x36c81e0Ec22CaC063A0588b6165CE3Fd022ab5b0")
    console.log(hre.ethers.formatEther(balanceOfUser.toString()) + ' WETH')

    let transaction = await Weth.connect(impersonatedSigner).deposit({ value: hre.ethers.parseEther('0.1111')})
    await transaction.wait()

    let balanceOfFakeUser = await Weth.balanceOf('0x1234567890123456789012345678901234567890')
    console.log(hre.ethers.formatEther(balanceOfFakeUser.toString()) + ' WETH')

    let transaction2 = await Weth.connect(impersonatedSigner).withdraw(hre.ethers.parseEther('0.1111'))
    await transaction2.wait()

    balanceOfFakeUser = await Weth.balanceOf('0x1234567890123456789012345678901234567890')
    console.log(hre.ethers.formatEther(balanceOfFakeUser.toString()) + ' WETH')
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
