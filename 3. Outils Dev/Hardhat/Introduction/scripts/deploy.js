const hre = require("hardhat");

async function main() {
  const arguments = [5]
  const SimpleStorage = await hre.ethers.deployContract("SimpleStorage", arguments)

  await SimpleStorage.waitForDeployment()
  console.log(`SimpleStorage deployed to ${SimpleStorage.target} with args ${arguments}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
