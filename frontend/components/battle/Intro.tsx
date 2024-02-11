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

const Intro = () => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [minted, setMinted] = useState<boolean>(false);
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

  const StartGame = async () => {
    try {
      const { hash } = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: Snowfight.abi,
        functionName: "startGame",
      });
      setLoading(true);
      await waitForTransaction({
        hash,
      });

      setGameStarted(true)
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const mintTheNFT = async (nftNum: number) => {
    try {
      console.log("NFT Number:", nftNum);
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
    console.log("---", contractAddress)
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

  console.log(images);

  return (
    <div className="min-h-screen w-full ">
      <>
        {!loading && (
          <div className="container relative mx-auto md:p-0">
            <div className="flex flex-col items-center justify-center -mt-6 md:mt-0 sm:-ml-0 md:-ml-12">
              <div className="text-center md:text-left md:ml-16 space-x-2 space-y-2">
                {!loading && !minted && (
                  <>
                    <h1 className="text-3xl md:text-5xl pt-6 font-bold text-center text-white">
                      {gameStarted ?
                        "Choose Your Fighter"
                        :
                        "The Fighters"
                      }
                    </h1>
                    {gameStarted && <div className="flex flex-col items-center justify-center mx-auto md:mt-0 sm:-ml-0 ">
                      <Button
                        onClick={() => {
                          StartGame();
                        }}
                        text="Start Game"
                      />
                    </div>}
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
                            className="max-w-xs flex flex-col items-center cursor-pointer transition-transform duration-300 transform hover:scale-125"
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
                                onClick={() => {
                                  mintTheNFT(index);
                                }}
                                text={image.buttonText}
                              />
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {minted && (
                  <div
                    className="max-w-xs m-auto bg-green-500 text-sm text-white rounded-md shadow-lg dark:bg-green-900"
                    role="alert"
                  >
                    <div className="flex p-4">
                      <span>Success. Click to close.</span>

                      <div className="ml-auto">
                        <button
                          type="button"
                          onClick={() => setMinted(false)}
                          className="inline-flex flex-shrink-0 justify-center items-center h-4 w-4 rounded-md text-white/[.5] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-600 transition-all text-sm dark:focus:ring-offset-gray-900 dark:focus:ring-gray-800"
                        >
                          <span className="sr-only">Close</span>
                          <svg
                            className="w-3.5 h-3.5"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.92524 0.687069C1.126 0.486219 1.39823 0.373377 1.68209 0.373377C1.96597 0.373377 2.2382 0.486219 2.43894 0.687069L8.10514 6.35813L13.7714 0.687069C13.8701 0.584748 13.9882 0.503105 14.1188 0.446962C14.2494 0.39082 14.3899 0.361248 14.5321 0.360026C14.6742 0.358783 14.8151 0.38589 14.9468 0.439762C15.0782 0.493633 15.1977 0.573197 15.2983 0.673783C15.3987 0.774389 15.4784 0.894026 15.5321 1.02568C15.5859 1.15736 15.6131 1.29845 15.6118 1.44071C15.6105 1.58297 15.5809 1.72357 15.5248 1.85428C15.4688 1.98499 15.3872 2.10324 15.2851 2.20206L9.61883 7.87312L15.2851 13.5441C15.4801 13.7462 15.588 14.0168 15.5854 14.2977C15.5831 14.5787 15.4705 14.8474 15.272 15.046C15.0735 15.2449 14.805 15.3574 14.5244 15.3599C14.2437 15.3623 13.9733 15.2543 13.7714 15.0591L8.10514 9.38812L2.43894 15.0591C2.23704 15.2543 1.96663 15.3623 1.68594 15.3599C1.40526 15.3574 1.13677 15.2449 0.938279 15.046C0.739807 14.8474 0.627232 14.5787 0.624791 14.2977C0.62235 14.0168 0.730236 13.7462 0.92524 13.5441L6.59144 7.87312L0.92524 2.20206C0.724562 2.00115 0.611816 1.72867 0.611816 1.44457C0.611816 1.16047 0.724562 0.887983 0.92524 0.687069Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
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