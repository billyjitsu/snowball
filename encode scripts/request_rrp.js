const hre = require("hardhat");
const airnodeAdmin = require("@api3/airnode-admin");
const { encode } = require("@api3/airnode-abi");
const { decode } = require("@api3/airnode-abi");

async function main() {

  // Set the request parameters for your Airnode Request.
  const airnodeAddress = "0xbBaf8B6C5d1C9fBCBf2A45f4b7b450415F936a92";
  const airnodeXpub =
    "xpub6CwZtnGRBF7un11xEdTCCfArQYFq7x1E3B2TRg9Vj6RudpepEyt7EJT1oVGyYp1aF4MHDmPY5MNuWBfuZ7S1BYCypAy8SStCjLnZ5Re8mUk";
  const endpointId =
    "0x6e58ace4ab94d28da59ec1da675b513cc21a3ca9656228c0b052563a2eb88b3e";
  const sponsor = RrpRequester.address;
  const sponsorWallet = await airnodeAdmin.deriveSponsorWalletAddress(
    airnodeXpub,
    airnodeAddress,
    sponsor
  );
  
  console.log(`Sponsor wallet address: ${sponsorWallet}`);
  
  // Encode your API Params. Check out the docs for more info https://docs.api3.org/reference/airnode/latest/specifications/airnode-abi.html
  //   const params = [
  //     { type: 'string', name: 'param1', value: 'value1' }, { type: 'string', name: 'param2', value: 'value2' }, { type: 'string', name: '_path', value: '' }, { type: 'string', name: '_type', value: 'int256' }
  //     ];
  const params = [
    { type: "string", name: "seasonID", value: "6" },
    { type: "string", name: "_path", value: "data.0.id" },
    { type: "string", name: "_type", value: "int256" },
  ];
  const encodedParameters = encode(params);

  // Make a request...
  const receipt = await RrpRequesterContract.makeRequest(
    airnodeAddress,
    endpointId,
    sponsor,
    sponsorWallet,
    encodedParameters,
    { gasLimit: 500000 }
  );
  console.log(
    "Created a request transaction, waiting for it to be confirmed..."
  );
  // // and read the logs once it gets confirmed to get the request ID
  // const requestId = await new Promise((resolve) =>
  //   hre.ethers.provider.once(receipt.hash, (tx) => {
  //     // We want the log from RrpRequesterContract
  //     const log = tx.logs.find(
  //       (log) => log.address === RrpRequesterContract.address
  //     );
  //     const parsedLog = RrpRequesterContract.interface.parseLog(log);
  //     resolve(parsedLog.args.requestId);
  //   })
  // );
  // console.log(`Transaction is confirmed, request ID is ${requestId}`);

  // // Wait for the fulfillment transaction to be confirmed and read the logs to get the random number
  // console.log("Waiting for the fulfillment transaction...");
  // const log = await new Promise((resolve) =>
  //   hre.ethers.provider.once(
  //     RrpRequesterContract.filters.RequestFulfilled(requestId, null),
  //     resolve
  //   )
  // );
  // const parsedLog = RrpRequesterContract.interface.parseLog(log);
  // const decodedData = parsedLog.args.response;
  // console.log(
  //   `Fulfillment is confirmed, response is ${decodedData.toString()}`
  // );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
