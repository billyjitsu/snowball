import {
  readContract,
} from "@wagmi/core";
import Snowfight from "../contract/contract.json";
import { useAccount } from "wagmi";
import { MintedData } from "../types";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const getIsGameInProgress = async () => {
  try {
    const isGameOver = await readContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: Snowfight.abi,
      functionName: "getIsGameInProgress",
    });

    return isGameOver;
  } catch (error) {
    console.log(error);
  }
}

export const checkWhichNFT = async (address: string) => {
  try {
    const hasMinted = await readContract({
      address: contractAddress as `0x${string}`,
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

export const fetchNFT = async (address: string | undefined) => {
  if (!address) return;

  try {
    const mintedData: MintedData | null = await checkWhichNFT(address as `0x${string}`) as MintedData;
    return mintedData;
  } catch (err) {
    console.log("Error fetching NFT: ", err)
  }
};

export const isValidAddress = (input: any) => {
  // Basic validation logic (can be expanded)
  return input.length === 42 || input.endsWith(".eth");
};

export const formatAddress = (address: string | undefined) => {
  if (!address) return;
  return `${address.slice(0, 6)}...${address.slice(address.length - 6)}`
}