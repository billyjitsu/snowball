import {
  readContract,
} from "@wagmi/core";
import Snowfight from "../contract/contract.json";
import { useAccount } from "wagmi";

const contractAddress = "0xdA976c89DbC30046Bb093dfa1E457AB1A51305ED";

export const checkWhichNFT = async (address: any) => {
  try {
    const hasMinted = await readContract({
      address: contractAddress,
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
