const hre = require("hardhat");
const { verify } = require('../utils/verify')
const { network } = require("hardhat")

async function main() {
  const arguments = []
  const Bank = await hre.ethers.deployContract('Bank', arguments);
  let transaction = await Bank.deploymentTransaction().wait(network.config.blockConfirmations || 1)

  console.log(
    `Bank deployed to ${Bank.target}`
  );

  // Vérification éventuel
  if(!network.name.includes('localhost') && process.env.ETHERSCAN) {
    console.log('Verifying...')
    await verify(Bank.target, arguments)
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
