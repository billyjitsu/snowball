import {
  readContract,
} from "@wagmi/core";
import Snowfight from "../contract/contract.json";
import { useAccount } from "wagmi";

const contractAddress = "0x893b67416Df9D9d0cD64f1e1B484Cc7eAAfd3195";

export const checkWhichNFT = async (address: any) => {
  try {
    const hasMinted = await readContract({
      address: contractAddress,
      abi: Snowfight.abi,
      functionName: "checkIfUserNFT",
      args: [address],
    });
    // console.log("Has Minted:", hasMinted);
    return hasMinted;
  } catch (error) {
    console.log(error);
  }
};
