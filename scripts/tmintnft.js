const ethers = require("ethers");
const airnodeAdmin = require("@api3/airnode-admin");
require("dotenv").config();
const ABI = require("../artifacts/contracts/NFTAttack.sol/NFTAttack.json");
const { airnodeAddress, airnodeXpub, endPointAddress, yourDeployedContractAddress, sponsorWallet } = require("./variables");


async function main() {

  // const airnodeAddress = "0x6238772544f029ecaBfDED4300f13A3c4FE84E1D";
  // const endPointAddress = "0x94555f83f1addda23fdaa7c74f27ce2b764ed5cc430c66f5ff1bcf39d583da36";
  // const SponsorWallet = "0x2bEF014Ad8Ca5eFB9D06d483590812c97196eC1F";

  // Connect to a provider (e.g., Infura, Alchemy)
  const provider = new ethers.JsonRpcProvider(process.env.BLAST_SEPOLIOA_RPC_URL);
  // Use your private key (keep this secure!)
  const privateKey = process.env.PRIVATE_KEY;
  const privateKey2 = process.env.PRIVATE_KEY2;
  const wallet = new ethers.Wallet(privateKey, provider);
  const wallet2 = new ethers.Wallet(privateKey2, provider);

  // Smart contract ABI and address
  const contractABI = ABI.abi;
  // //const contractAddress = "your_contract_address";
  // const contractAddress = "0x893b67416Df9D9d0cD64f1e1B484Cc7eAAfd3195";

  // Create a contract instance
  const contract = new ethers.Contract(yourDeployedContractAddress, contractABI, wallet);
  const contract2 = new ethers.Contract(yourDeployedContractAddress, contractABI, wallet2);

  console.log(
    "Starting The Game..."
  );

  //START the game
  const starter = await contract.startGame();
    let txReceiptStarter = await starter.wait();
    if (txReceiptStarter.status === 0) {
      throw new Error("Transaction failed");
    }
    console.log(
      "Game Started"
    );

    console.log(
      "Minting NFTs..."
    );

  //make sure to pay!!!!
  const receipt = await contract.enterTheArena(0 ,{value: ethers.parseEther("0.05")});

  let txReceipt = await receipt.wait();
  if (txReceipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log(
    "Owner Minted NFT"
  );

  const receipt2 = await contract2.enterTheArena(1, {value: ethers.parseEther("0.05")});

  let txReceipt2 = await receipt2.wait();
  if (txReceipt2.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log(
    "Other Wallet Minted NFT"
  );
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
