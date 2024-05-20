require('@nomicfoundation/hardhat-toolbox');
require('@openzeppelin/hardhat-upgrades');
require('hardhat-contract-sizer');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('hardhat-docgen');
require('dotenv').config();

const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY || "";
const BASE_PRIVATE_KEY = process.env.BASE_PRIVATE_KEY || "";
const BASE_SEPOLIA_PRIVATE_KEY = process.env.BASE_SEPOLIA_PRIVATE_KEY || "";
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || "";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const exportNetworks = {
  hardhat: {
  },
}

if (POLYGON_PRIVATE_KEY != "") {
  exportNetworks["polygon"] = {
    url: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
    accounts: [`${POLYGON_PRIVATE_KEY}`]
  };
}

if (BASE_PRIVATE_KEY != "") {
  exportNetworks["base"] = {
    url: `https://mainnet.base.org`,
    accounts: [`${BASE_PRIVATE_KEY}`],
  }
}

if (BASE_SEPOLIA_PRIVATE_KEY != "") {
  exportNetworks["base-sepolia"] = {
    url: 'https://sepolia.base.org',
    accounts: [`${BASE_SEPOLIA_PRIVATE_KEY}`],
  }
}

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000
          }
        }
      }
    ]
  },
  defaultNetwork: "hardhat",
  networks: exportNetworks,
  etherscan: {
    apiKey: {
      base: BASESCAN_API_KEY,
      "base-sepolia": BASESCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
         apiURL: "https://api-sepolia.basescan.org/api",
         browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  }
};

