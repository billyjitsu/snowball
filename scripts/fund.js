const ethers = require("ethers");
const airnodeAdmin = require("@api3/airnode-admin");
require("dotenv").config();
const { airnodeAddress, airnodeXpub, endPointAddress, yourDeployedContractAddress, sponsorWallet } = require("./variables");


async function main() {

  //Deploy it on the chain with the following providers
  // https://docs.api3.org/reference/qrng/chains.html
  // Sepolia - 0x2ab9f26E18B64848cd349582ca3B55c2d06f507d


  // Airnode Parameters
  // https://docs.api3.org/reference/qrng/providers.html

  // const airnodeAddress = "0x6238772544f029ecaBfDED4300f13A3c4FE84E1D";
  // const airnodeXpub = "xpub6CuDdF9zdWTRuGybJPuZUGnU4suZowMmgu15bjFZT2o6PUtk4Lo78KGJUGBobz3pPKRaN9sLxzj21CMe6StP3zUsd8tWEJPgZBesYBMY7Wo";
  // // const yourDeployedContractAddress = "Your Deployed Contract Address here";
  // const yourDeployedContractAddress = "0x893b67416Df9D9d0cD64f1e1B484Cc7eAAfd3195";
  const amountInEther = 0.001;

  // Connect to a provider (e.g., Infura, Alchemy)
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

  // Use your private key (keep this secure!)
  const privateKey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);

  // We are deriving the sponsor wallet address from the RrpRequester contract address
  // using the @api3/airnode-admin SDK. You can also do this using the CLI
  // https://docs.api3.org/airnode/latest/reference/packages/admin-cli.html
  // Visit our docs to learn more about sponsors and sponsor wallets
  // https://docs.api3.org/airnode/latest/concepts/sponsor.html
  const sponsorWalletAddress = await airnodeAdmin.deriveSponsorWalletAddress(
    airnodeXpub,
    airnodeAddress,
    yourDeployedContractAddress
  );

  console.log(`Sponsor wallet address: ${sponsorWalletAddress}`);

  const receipt = await wallet.sendTransaction({
    to: sponsorWalletAddress,
    value: ethers.parseEther(amountInEther.toString()),
  });
  console.log(
    `Funding sponsor wallet at ${sponsorWalletAddress} with ${amountInEther} ...`
  );
  
  let txReceipt = await receipt.wait();
  if (txReceipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Sponsor wallet funded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
