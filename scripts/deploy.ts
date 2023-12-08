import { ethers } from "hardhat";

async function main() {

  const airnode = "0xa0AD79D995DdeeB18a14eAef56A549A04e3Aa1Bd" // Airnode Base
  
  const TokenEx = await ethers.getContractFactory("SnowDay");
  const tokenEx = await TokenEx.deploy(
    ["Tank", "Balanced", "Swift"],
    ["https://i.imgur.com/DYy7js6.jpeg", 
    "https://i.imgur.com/lgPFnUw.jpeg", 
    "https://i.imgur.com/yRMhDS0.jpeg"],
    [300, 200, 100],    //HP
    [25, 20, 25],       //Attack
    [20, 15, 10],       //Defense
    [0, 10, 20],       //Evade                                  
  );

  await tokenEx.waitForDeployment();

  console.log(`TokenEx contract address: ${tokenEx.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
