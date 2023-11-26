const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('Game');
    const gameContract = await gameContractFactory.deploy(
      ["Cap America", "Hulk", "Witch"],
      ["https://i.imgur.com/DYy7js6.jpeg", 
      "https://i.imgur.com/lgPFnUw.jpeg", 
      "https://i.imgur.com/yRMhDS0.jpeg"],
      [100, 200, 300],                                                
    );
    // await gameContract.deployed();
    await gameContract.waitForDeployment();
    console.log(`Contract deployed to:, ${gameContract.target}`);
  
    /*
    let txn;
    txn = await gameContract.mintCharacterNFT(2);
    await txn.wait();
    */
  
  
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();