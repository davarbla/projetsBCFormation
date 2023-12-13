const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners()
  
  const AlyraIsERC20 = await hre.ethers.deployContract("AlyraIsERC20", [signers[0].address]);

  await AlyraIsERC20.waitForDeployment();

  console.log(
    `AlyraIsERC20 deployed to ${AlyraIsERC20.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
