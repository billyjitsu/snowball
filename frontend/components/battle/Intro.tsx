import dynamic from "next/dynamic";
import {
  getAccount,
  fetchBalance,
  readContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
import React, { useState, useEffect, startTransition } from "react";
import LoadingScreen from "../Loading";
import { parseEther } from "viem";
import Snowfight from "../../contract/contract.json";
import Loading from "../Loading";
import Button from "../Button";
import Router from "next/router";
import { Dispatch, SetStateAction } from 'react';

interface IntroProps {
  setMinted: Dispatch<SetStateAction<boolean>>;
}
const Intro: React.FC<IntroProps> = ({ setMinted }) => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  // const [minted, setMinted] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(true); // @TODO change this based on game status
  const ethStakeAmount = 0.05;

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const contractConfig = {
    address: contractAddress,
    abi: Snowfight.abi,
  };

  const images = [
    {
      src: "https://i.imgur.com/DYy7js6.jpeg",
      description: "Heavy Tank Character",
      buttonText: "Choose",
    },
    {
      src: "https://i.imgur.com/lgPFnUw.jpeg",
      description: "Midrange Character",
      buttonText: "Choose",
    },
    {
      src: "https://i.imgur.com/yRMhDS0.jpeg",
      description: "Quick Evasive Character",
      buttonText: "Choose",
    },
  ];

  const mintTheNFT = async (nftNum: number) => {
    try {
      const { hash } = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: Snowfight.abi,
        functionName: "enterTheArena",
        args: [nftNum],
        value: parseEther(ethStakeAmount.toString()),
      });
      setLoading(true);
      await waitForTransaction({
        hash,
      });

      setLoading(false);
      setMinted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfUserHasMinted = async () => {
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

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected) {
        try {
          const mintedData = await checkIfUserHasMinted();
          console.log("Mint status:", mintedData);
          // You can set state or perform other actions based on mintedData here
        } catch (error) {
          console.error("Error fetching mint status:", error);
        }
      }
    };

    fetchData();
  }, [isConnected]);


  return (
    <div className="min-h-screen w-full ">
      <>
        {!loading && (
          <div className="container relative mx-auto md:p-0">
            <div className="flex flex-col items-center justify-center -mt-6 md:mt-0 sm:-ml-0 md:-ml-12">
              <div className="text-center md:text-left md:ml-16 space-x-2 space-y-2">
                {!loading && (
                  <>
                    <h1 className="text-lg md:text-5xl pt-6 font-bold text-center text-white">
                      {gameStarted ?
                        "Choose Your Fighter"
                        :
                        "The Fighters"
                      }
                    </h1>
                    <p className="text-white text-center text-xl">
                      {gameStarted ?
                        "May the odds be in your favor"
                        :
                        "Game must be started before minting your fighter"
                      }
                    </p>

                    {/* Image Gallery */}
                    <div className="container mx-auto p-4">
                      <div className="flex flex-row justify-between">
                        {images.map((image, index: number) => (
                          <div
                            key={index}
                            onClick={() => mintTheNFT(index)}
                            className="max-w-xs flex flex-col items-center cursor-pointer transition-transform duration-300 transform hover:scale-110"
                          >
                            <img
                              src={image.src}
                              alt=""
                              className="w-3/4 h-auto rounded-lg"
                            />
                            <p className="text-center text-2xl mt-2">
                              {image.description}
                            </p>
                            {gameStarted &&
                              <Button
                                text={image.buttonText}
                              />
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Loading Screen */}
        <div className="text-center">{loading && isConnected && <Loading size="md" />}</div>
      </>
    </div>
  );
};

// export default Intro;
export default dynamic(() => Promise.resolve(Intro), { ssr: false });
