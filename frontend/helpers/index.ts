import {
  readContract,
} from "@wagmi/core";
import Snowfight from "../contract/contract.json";
import { useAccount } from "wagmi";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const checkWhichNFT = async (address: string) => {
  try {
    const hasMinted = await readContract({
      address: contractAddress as `0x${string}` ,
      abi: Snowfight.abi,
      functionName: "checkIfTargetHasNFT",
      args: [address],
    });
    // console.log("Has Minted:", hasMinted);
    return hasMinted;
  } catch (error) {
    console.log(error);
  }
};
