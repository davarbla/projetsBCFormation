const hre = require("hardhat");
const fs = require('fs-extra');
require('dotenv').config();

async function main() {
  // https://docs.ethers.org/v6/api/providers/jsonrpc/#JsonRpcProvider
  const provider = new hre.ethers.JsonRpcProvider(process.env.RPC_URL);
  const encryptedJson = fs.readFileSync('./.encryptedKey.json', 'utf8');

  // https://docs.ethers.org/v6/api/wallet/#Wallet_fromEncryptedJsonSync
  let wallet = hre.ethers.Wallet.fromEncryptedJsonSync(encryptedJson, process.env.PRIVATE_KEY_PASSWORD);

  // https://docs.ethers.org/v6/api/providers/#Signer-call
  wallet = await wallet.connect(provider);
  const abi = fs.readFileSync('./scripts/SimpleStorage.abi', 'utf8');
  const binary = fs.readFileSync('./scripts/SimpleStorage.bin', 'utf8');
  
  // https://docs.ethers.org/v6/api/contract/#ContractFactory
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  // https://docs.ethers.org/v6/api/contract/#ContractFactory-deploy
  const contract = await contractFactory.deploy()
  console.log(`Contract deployed to ${contract.target}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
