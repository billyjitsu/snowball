import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  readContract,
} from "@wagmi/core";
import { MintedData } from "../types";
import { checkWhichNFT, formatAddress } from "../helpers";
import NFTDataDisplay from "../components/NftCard";
import Snowfight from "../contract/contract.json";

import Button from "../components/Button";
import dynamic from "next/dynamic";

function Claim() {
  const { address, isConnected } = useAccount();
  const [nftData, setNftData] = useState<MintedData>()
  useEffect(() => {
    const fetchData = async () => {
      if (isConnected && address) {
        try {
          const hasMinted = await readContract({
            address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
            abi: Snowfight.abi,
            functionName: "checkIfUserNFT",
            args: [address],
          });
          setNftData(hasMinted);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
  }, [isConnected]);

  function handleClaim(): void {
    // @TODO handle claim
  }

  return (
    <div className="flex flex-col md:flex-row w-full justify-center">
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl md:text-5xl pt-6 font-bold text-center text-white">Claim</h1>
        <div className="max-w-[50%] text-center md:text-left space-x-2 space-y-2 flex flex-col items-center mx-auto">
          <p className="text-white text-lg text-center">Your NFT is burned. Refund for stake is returned and your share of the yield generated is included</p>

          {nftData && <NFTDataDisplay nftData={nftData} />}
          <Button onClick={handleClaim} text="Claim" />
        </div>
      </div>
    </div >
  )
}

export default dynamic(() => Promise.resolve(Claim), { ssr: false });
