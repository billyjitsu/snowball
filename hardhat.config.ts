import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter"
require('dotenv').config();


const config: HardhatUserConfig = {

solidity: {
  compilers: [
    {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
    {
      version: "0.8.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    }
  ],
},

networks: {
  
  hardhat: {
    chainId: 1337
  },
  goerlibase: {
    url: `${process.env.GOERLI_RPC_URL}`,
    accounts: [`${process.env.PRIVATE_KEY}`],
    // gas: 200000000,
    // gasPrice: 100000000000,
  },
  sepolia: {
    url: `${process.env.SEPOLIA_RPC_URL}`,
    accounts: [`${process.env.PRIVATE_KEY}`],
    // gas: 200000000,
    // gasPrice: 100000000000,
  },
  blastsepolia: {
    url: `${process.env.BLAST_SEPOLIOA_RPC_URL}`,
    accounts: [`${process.env.PRIVATE_KEY}`],
    gasPrice: 1000000000,
  },
  
  // mantle: {
  //   url: "https://rpc.mantle.xyz", //mainnet
  //   accounts: [process.env.ACCOUNT_PRIVATE_KEY ?? ''],
  //   },
  //   mantleTest: {
  //   url: "https://rpc.testnet.mantle.xyz", // testnet
  //   accounts: [process.env.ACCOUNT_PRIVATE_KEY ?? '']
  //   }

},
etherscan: {
//apiKey: process.env.ETHERSCAN_API_KEY || "",
apiKey: {
  blastsepolia: process.env.ETHERSCAN_API_KEY || "", // apiKey is not required, just set a placeholder
},
customChains: [
  {
    network: "blastsepolia",
    chainId: 168587773,
    urls: {
      apiURL: "https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan",
      browserURL: "https://testnet.blastscan.io"
    }
  }
  ]
},

sourcify: {
  enabled: false
},

gasReporter: {
  enabled: false
}
};

export default config;

