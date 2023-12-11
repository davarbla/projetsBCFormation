require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-verify")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ALCHEMY_RPC_URL = process.env.ALCHEMY_RPC_URL || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    // sepolia: {
    //   url: ALCHEMY_RPC_URL,
    //   accounts: [`0x${PRIVATE_KEY}`],
    //   chainId: 11155111,
    //   // blockConfirmations: 6
    // },
    mumbai: {
      url: ALCHEMY_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 80001,
      // blockConfirmations: 6
    },


  },
  solidity: {
    compilers: [
      {
        version: "0.8.20"
      },
      // {
      //   version: "0.6.4"
      // }
    ]
  },
  etherscan: {
    apiKey: {
      polygonMumbai: ETHERSCAN_API_KEY
    }
  }
};

//* Invalid account: #0 for network: sepolia - private key too short, expected 32 bytes