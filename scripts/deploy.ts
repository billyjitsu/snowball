import { ethers } from "hardhat";

async function main() {


  // const ape = await ethers.deployContract("SimpleToken", ["Ape Coin", "APE"], {});
  // await ape.waitForDeployment();
  // console.log(`SimpleToken contract address: ${ape.target}`);


  const airnode = "0xa0AD79D995DdeeB18a14eAef56A549A04e3Aa1Bd" // Airnode Base
  // The new way of deploying contracts    Name of Contract, Constructor Arguments, Overrides
  const tokenEx = await ethers.deployContract("Prediction", [airnode, "0xb8EAa40a7976474a47bB48291FE569f383069FBc"], {});

  await tokenEx.waitForDeployment();

  console.log(`TokenEx contract address: ${tokenEx.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
