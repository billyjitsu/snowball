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
  useContractEvent,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  UseContractEventConfig,
} from "wagmi";
import React, { useState, useEffect, useCallback } from "react";
import Snowfight from "../contract/contract.json";
import NFTDataDisplay from "./NftCard";
import Loading from "./Loading";
import Button from "./Button";

interface MissedAttack {
  attacker: string;
  victim: string;
}

interface SuccessfulAttack {
  attacker: string;
  victim: string;
  damageAmount: bigint;
  victimHp: bigint;
}

interface NFTBurned {
  victim: string;
  tokenId: bigint;
  attacker: string;
}

const Fight = () => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  let attacking: boolean = false;
  const [minted, setMinted] = useState<boolean>(false);
  const [nftData, setNftData] = useState<any>(null);
  const [defenderData, setDefenderData] = useState<any>(null);
  const [hover, setHover] = useState<boolean>(false);
  const [defenderAddress, setDefenderAddress] = useState<string>(
    "0x9263bFf6ACCb60E83254E95220e7637465298171"
  );
  const [attackResult, setAttackResult] = useState({ type: null, data: null });

  //  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractAddress = "0xdA976c89DbC30046Bb093dfa1E457AB1A51305ED";

  const contractConfig = {
    address: contractAddress,
    abi: Snowfight.abi,
  };

  useEffect(() => {
    if (!defenderAddress) {
      setDefenderData(null);
    }
  }, [defenderAddress]);

  const handleChange = (event: any) => {
    setDefenderAddress(event.target.value);
  };

  // Optional: Validate the input as Ethereum address or ENS name
  const isValidAddress = (input: any) => {
    // Basic validation logic (can be expanded)
    return input.length === 42 || input.endsWith(".eth");
  };

  // WE NEED TO CHECK IS THEY DON'T HAVE AN NFT
  const getnftdata = async (newAddress: string) => {
    console.log("Defender Address:", newAddress);
    const returnedData = await checkOpponentNFT(newAddress);
    console.log("Returned Data:", returnedData);
    setDefenderData(returnedData);
  };

  const attackTarget = async (targetAddress: string) => {
    try {
      setLoading(true);
      attacking = true;
      console.log("Starting Attack...");
      // setTimeout(() => {
      //   console.log("ATTACKING!")
      // }, 3000)
      const { hash } = await writeContract({
        address: contractAddress,
        abi: Snowfight.abi,
        functionName: "throwSnowball",
        args: [targetAddress],
        //  value: parseEther(ethAmount.toString()),
      });
      await waitForTransaction({
        hash,
      });

      console.log("hash:", hash);
      console.log("Waiting for the request to be fulfilled...");

      // Extract transaction hash from the receipt
      // const transactionHash = hash;
      setLoading(false);
      // attacking = false;
      // setMinted(true);
    } catch (error) {
      console.log(error);
    }
  };


  // Separate handlers for each event type to update state accordingly
  // const handleMissedAttack = useCallback((event: { args: any[]; }) => {
  //   if (event.args[0] !== address) return;
  //   console.log("Missed Attack:", event);
  //   setAttackResult({ type: 'MissedAttack', data: event });
  //   setLoading(false);
  // }, [address]);

  // const handleSuccessfulAttack = useCallback((event: { args: any[]; }) => {
  //   if (event.args[0] !== address) return;
  //   console.log("Successful Attack:", event);
  //   setAttackResult({ type: 'SuccessfulAttack', data: event });
  //   setLoading(false);
  // }, [address]);

  // const handleNFTBurned = useCallback((event: { args: any[]; }) => {
  //   if (event.args[2] !== address) return; // Assuming the address is the third argument for this event
  //   console.log("NFT Burned:", event);
  //   setAttackResult({ type: 'NFTBurned', data: event });
  //   setLoading(false);
  // }, [address]);

  // Setting up event listeners
  useContractEvent({
    ...contractConfig,
    eventName: 'MissedAttack',
    listener: (log) => {
      console.log("Event Name:", log[0].eventName);
      if(log[0].eventName === "MissedAttack") {
        const { attacker, victim } = log[0].args as unknown as MissedAttack;
        console.log(`Attacker: ${attacker}, Victim: ${victim}`);
      }
    
      if(log[0].eventName === "SuccessfulAttack") {
        const { attacker, victim, damageAmount, victimHp } = log[0].args as unknown as SuccessfulAttack;
        console.log(`Attacker: ${attacker}, Victim: ${victim}, Damage: ${damageAmount}, Victim HP: ${victimHp}`);
      }

      if(log[0].eventName === "NFTBurned") {
        const { victim, tokenId, attacker } = log[0].args as unknown as NFTBurned;
        console.log(`Victim: ${victim}, Token ID: ${tokenId}, Attacker: ${attacker}`);
      }

      console.log("First Arg",log[0].args); // Log the event data

    },
  } as UseContractEventConfig);

  // // Setting up event listeners
  // useContractEvent({
  //   ...contractConfig,
  //   eventName: 'SuccessfulAttack',
  //   listener: (event) => {
  //     console.log("Hit",event); // Log the event data
  //   },
  // } as UseContractEventConfig);

  // useContractEvent({
  //   ...contractConfig,
  //   eventName: 'NFTBurned',
  //   listener: (event) => {
  //     console.log("Burned",event); // Log the event data
  //   },
  // } as UseContractEventConfig);

  
  
  ///// example
  // useContractEvent({
  //   address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  //   abi: ensRegistryABI,
  //   eventName: 'NewOwner',
  //   listener: (event) => {
  //     console.log(event); // Log the event data
  //     // Perform an action when the event happens
  //     // Assuming the event has an argument for the new owner's address
  //     const ownerAddress = event.args[0];
  //     setNewOwner(ownerAddress); // Update state with the new owner's address

  //     // You can also trigger any other side effect here, such as notifying the user
  //   },
  // });


  const checkWhichNFT = async () => {
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

  const checkOpponentNFT = async (newAddress: string) => {
    try {
      const hasMinted = await readContract({
        address: contractAddress,
        abi: Snowfight.abi,
        functionName: "checkIfUserNFT",
        args: [newAddress],
      });
      // console.log("Has Minted:", hasMinted);
      return hasMinted;
    } catch (error) {
      console.log(error);
    }
  };

  //lister for the event

  useEffect(() => {
    if (isValidAddress(defenderAddress)) {
      console.log("Valid address:", defenderAddress);
      getnftdata(defenderAddress);
    }
  }, [defenderAddress]);

  useEffect(() => {
    interface MintedData {
      name: string;
      imageURI: string;
      hp: number;
      attackDamage: number;
      defense: number;
      evade: number;
      // Add other properties if needed
    }

    const fetchData = async () => {
      if (isConnected) {
        try {
          const mintedData: MintedData = (await checkWhichNFT()) as MintedData;
          setNftData(mintedData);
          // console.log("Mint status:", mintedData);
          // console.log("Image:", mintedData.imageURI);
          // console.log("Name:", mintedData.name);
          // console.log("Health:", mintedData.hp.toString());
          // console.log("Attack:", mintedData.attackDamage.toString());
          // console.log("Defense:", mintedData.defense.toString());
          // console.log("Evade:", mintedData.evade.toString());
        } catch (error) {
          console.error("Error fetching mint status:", error);
        }
      }
    };

    fetchData();
  }, [isConnected]);

  return (
    <>
      <div className="flex flex-col md:flex-row w-full justify-center">
        <div className="flex flex-col justify-center">
          <div className="text-center md:text-left space-x-2 space-y-2">
            {!minted && (
              <>
                <h1 className="text-3xl md:text-5xl pt-6 font-bold text-center text-white">
                  READY YOUR SNOWBALL
                </h1>
                <div className="mt-6 w-full flex flex-col justify-center">
                  {/* <p className="text-center">Choose your Victim</p> */}
                  <div className="w-full text-center font-sans">
                    <input
                      type="text"
                      value={defenderAddress}
                      onChange={handleChange}
                      placeholder="Enter Ethereum Address or ENS Name"
                      className="w-1/2 p-2 border border-gray-300 rounded mx-auto"
                    />
                    {defenderAddress && !isValidAddress(defenderAddress) && (
                      <p className="text-red-500">
                        Invalid address or ENS name
                      </p>
                    )}
                  </div>
                </div>
                {/* <p className="text-white text-center text-xl">
                          May the odds be in your favor
                        </p> */}

                {/* Image  */}
                <div
                  className={`flex flex-col md:flex-row items-center mx-auto w-full py-6 px-4 md:px-8`}
                >
                  {/* Attacker */}
                  {nftData && (
                    <div className="flex flex-col items-center">
                      <h1 className="text-2xl text-white">You</h1>
                      <NFTDataDisplay nftData={nftData} />
                    </div>
                  )}

                  {/* VS */}
                  {defenderData && !loading && (
                    <div className="flex flex-col relative rounded-md mx-auto">
                      <h1 className="text-6xl font-bold relative z-0 whitespace-nowrap text-white hidden md:block lg:block">
                        VS
                      </h1>
                      <div className="relative">
                        {defenderAddress && isValidAddress(defenderAddress) && (
                          <Button
                            onClick={() => attackTarget(defenderAddress)}
                            text="Attack"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {defenderData && loading && <Loading action="ATTACKING" />}

                  {/* Defender */}
                  {defenderData && (
                    <div className="flex flex-col items-center">
                      <h1 className="text-2xl text-white">Opponent</h1>
                      <NFTDataDisplay nftData={defenderData} />
                    </div>
                  )}
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
    </>
  );
};

// export default Fight;
export default dynamic(() => Promise.resolve(Fight), { ssr: false });
