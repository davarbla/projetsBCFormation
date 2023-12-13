require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/tXP--1Ur6Swlv3JBogAQRPc9NFsRuUAt",
        blockNumber: 18776230
      }
    }
  }
};
