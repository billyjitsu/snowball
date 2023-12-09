import { ethers } from "hardhat";

async function main() {

  const airnode = "0x2ab9f26E18B64848cd349582ca3B55c2d06f507d"; // Airnode Sepolia
  const names = ["Tank", "Balanced", "Swift"];
  const images = ["https://i.imgur.com/DYy7js6.jpeg", 
    "https://i.imgur.com/lgPFnUw.jpeg", 
    "https://i.imgur.com/yRMhDS0.jpeg"];
  const hp = [300, 200, 100];
  const attack = [25, 20, 25];
  const defense = [20, 15, 10];
  const evade = [0, 10, 20];
  
  const TokenEx = await ethers.getContractFactory("NFTAttack");
  const tokenEx = await TokenEx.deploy(airnode, names, images, hp, attack, defense, evade);                                

  await tokenEx.waitForDeployment();

  console.log(`TokenEx contract address: ${tokenEx.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
