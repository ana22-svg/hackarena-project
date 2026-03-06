require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://eth-mainnet.g.alchemy.com/v2/7ugFz9qhR-_v1uAsrR9lM",
      accounts: ["4fdbdc7eaa8a2b1cd9b1619e25d1c8b0e5f8457f2cd142992a048df9240180a0"]
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    hardhat: {
      chainId: 31337
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
