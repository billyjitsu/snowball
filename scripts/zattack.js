const ethers = require("ethers");
const airnodeAdmin = require("@api3/airnode-admin");
require("dotenv").config();
const ABI = require("../artifacts/contracts/NFTAttack.sol/NFTAttack.json");
const { airnodeAddress, airnodeXpub, endPointAddress, yourDeployedContractAddress, sponsorWallet } = require("./variables");
const { latest } = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time");


async function main() {
  // Connect to a provider (e.g., Infura, Alchemy)
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  // Use your private key (keep this secure!)
  const privateKey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);

  // Smart contract ABI and address
  const contractABI = ABI.abi;

  // Create a contract instance
  const contract = new ethers.Contract(yourDeployedContractAddress, contractABI, wallet);

  console.log(
    "Starting Attack..."
  );

  const receipt = await contract.throwSnowball('0x9263bFf6ACCb60E83254E95220e7637465298171');

  let txReceipt = await receipt.wait();
  if (txReceipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log(
    "Request completed!"
  );

  // console.log("Tnx logs: ", txReceipt.logs);

  // console.log("transaction receieipt: ", txReceipt.logsBloom);
  // console.log("transaction receieipt full: ", txReceipt);

  const eventTopic = ethers.id('RequestUint256(bytes32)'); // Get the data hex string

  
  let rawlog = await provider.getLogs({
    address: contract.address,
    topics: [eventTopic],
    fromBlock: txReceipt.blockNumber - 1,
    toBlock: txReceipt.blockNumber
  });
 // console.log("rawlog: ", rawlog);

  // async function processLogsWithInterface() {
    // const abi = ABI.abi;
    // const intrfc = new ethers.Interface(abi);

    // rawlog.forEach((log) => {
    //     console.log(`BEFORE PARSING:`);
    //     console.debug(log);
    //     console.log(`\n`);

    //     console.log(`AFTER PARSING:`);
    //     let parsedLog = intrfc.parseLog(log);
    //     console.debug(parsedLog);
    //     console.log('************************************************');
    // })
//}


// //Working
// let events = await contract.queryFilter('RequestUint256', txReceipt.blockNumber, txReceipt.blockNumber);

//   console.log("Ethers version event:",events);
  

//   // //first listen for the event
//   // console.log("1st listen");
//   contract.on("RequestUint256", (requestID, event) => {
//     let info = {
//       requestID: requestID,
//       event: event,
//     };
//     console.log(JSON.stringify(info, null, 2));
//     }
//   );

  // 2nd listen
  // console.log("2nd listen");
  // contract.on("*", (from, to, tokenId, event) => {
  //   console.log(`${ from } => ${ to }: ${ tokenId }`)

  //     // Optionally, convenience method to stop listening
  //    // event.removeListener();
  // });

  // 3rd listen
  // console.log("3rd listen");
  // contract.on("*", (event) => { 
  //   console.log(event.eventName, event.args, event.log); 
  // });



  

  //////
//    // and read the logs once it gets confirmed to get the request ID
//    console.log("Waiting for the request to be fulfilled...");

//    const requestId = await new Promise((resolve) =>
//    contract.once(requestRandomNumber.hash, (tx) => {
//      // We want the log from RrpRequesterContract
//      const log = tx.logs.find(
//        (log) => log.address === contractAddress
//      );
//      const parsedLog = contract.interface.parseLog(log);
//      resolve(parsedLog.args.requestId);
//    })
//  );
//  console.log(`Transaction is confirmed, request ID is ${requestId}`);

//  // Wait for the fulfillment transaction to be confirmed and read the logs to get the random number
//  console.log("Waiting for the fulfillment transaction...");
//  const log = await new Promise((resolve) =>
//    hre.ethers.provider.once(
//      RrpRequesterContract.filters.RequestFulfilled(requestId, null),
//      resolve
//    )
//  );
//  const parsedLog = RrpRequesterContract.interface.parseLog(log);
//  const decodedData = parsedLog.args.response;
//  console.log(
//    `Fulfillment is confirmed, response is ${decodedData.toString()}`
//  );
 /////////////






  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
