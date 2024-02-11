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
import React, { useState, useEffect } from "react";
import Snowfight from "../../contract/contract.json";
import NFTDataDisplay from "../NftCard";
import Loading from "../Loading";
import Button from "../Button";
import { MintedData } from "../../types";
import AttackSummary from "../AttackSummary";
import { isValidAddress } from "../../helpers";

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
  const [attacking, setAttacking] = useState<boolean>(false);
  const [attackComplete, setAttackComplete] = useState<boolean>(false)
  const [damageAmount, setDamageAmount] = useState<bigint>()

  const [minted, setMinted] = useState<boolean>(false);
  const [nftData, setNftData] = useState<any>(null);
  const [defenderData, setDefenderData] = useState<any>(null);
  const [hover, setHover] = useState<boolean>(false);
  const [defenderAddress, setDefenderAddress] = useState<string>(
    "0xe2b8651bF50913057fF47FC4f02A8e12146083B8"
  );
  const [attackResult, setAttackResult] = useState<number>(0);
  // 1 = Missed Attack 2 = Successful Attack 3 = NFT Burned
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const contractConfig = {
    address: contractAddress,
    abi: Snowfight.abi,
  };

  useEffect(() => {
    setLoading(true);
    if (!defenderAddress) {
      setDefenderData(null);
    }
    setLoading(false);
  }, [defenderAddress]);

  useEffect(() => {
    setLoading(true);
    getnftdata(defenderAddress);
  }, [defenderData?.hp])

  const handleChange = (event: any) => {
    setDefenderAddress(event.target.value);
  };

  // WE NEED TO CHECK IS THEY DON'T HAVE AN NFT
  const getnftdata = async (newAddress: string) => {
    setLoading(true);
    console.log("Defender Address:", newAddress);
    const returnedData = await checkOpponentNFT(newAddress);
    console.log("Returned Data:", returnedData);
    const isInvalidNFT: boolean = !returnedData?.name && !returnedData?.imageURI
    isInvalidNFT ? setDefenderData(null) : setDefenderData(returnedData);
    setLoading(false);
  };

  const attackTarget = async (targetAddress: string) => {
    try {
      setAttackResult(0);
      // setLoading(true);
      setAttacking(true)
      console.log("Starting Attack...");
      const { hash } = await writeContract({
        address: contractAddress as `0x${string}`,
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
      // setLoading(false);
      setAttackComplete(true)
    } catch (error) {
      setLoading(false);
      setAttacking(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setAttacking(false)

  }, [defenderData?.hp])

  useEffect(() => {
    if (attackResult === 1) {
      setAttacking(false)
    }
  }, [attackResult])


  // Separate handlers for each event type to update state accordingly
  // const handleMissedAttack =(event: { args: any[]; }) => {
  //   if (event.args[0] !== address) return;
  //   console.log("Missed Attack:", event);
  //   setAttackResult({ type: 'MissedAttack', data: event });
  //   setLoading(false);
  // };

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
      setAttacking(true);
      console.log("Event Name:", log[0].eventName);
      if (log[0].eventName === "MissedAttack") {
        const { attacker, victim } = log[0].args as unknown as MissedAttack;
        console.log(`Attacker: ${attacker}, Victim: ${victim}`);
        setAttackResult(1);
      }

      if (log[0].eventName === "SuccessfulAttack") {
        const { attacker, victim, damageAmount, victimHp } = log[0].args as unknown as SuccessfulAttack;
        console.log(`Attacker: ${attacker}, Victim: ${victim}, Damage: ${damageAmount}, Victim HP: ${victimHp}`);
        setDefenderData((prevState: any) => ({
          ...prevState,
          hp: victimHp
        }))
        setDamageAmount(damageAmount);
        setAttackResult(2);
      }

      if (log[0].eventName === "NFTBurned") {
        const { victim, tokenId, attacker } = log[0].args as unknown as NFTBurned;
        console.log(`Victim: ${victim}, Token ID: ${tokenId}, Attacker: ${attacker}`);
        setAttackResult(3);
      }


      console.log("First Arg", log[0].args); // Log the event data
      // console.log ("Attack Result:", attackResult);

    },
  } as UseContractEventConfig);

  useEffect(() => {
    if (attackResult === 3) {
      // run animations
      // push to claim page
    }
  }, [attackResult])

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
        address: contractAddress as `0x${string}`,
        abi: Snowfight.abi,
        functionName: "checkIfUserNFT",
        args: [address],
      });
      return hasMinted;
    } catch (error) {
      console.log(error);
    }
  };

  const checkOpponentNFT = async (newAddress: string) => {
    try {
      const hasMinted = await readContract({
        address: contractAddress as `0x${string}`,
        abi: Snowfight.abi,
        functionName: "checkIfUserNFT",
        args: [newAddress],
      });
      return hasMinted;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isValidAddress(defenderAddress)) {
      const result = getnftdata(defenderAddress);
    }
  }, [defenderAddress]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (isConnected) {
        try {
          const mintedData: MintedData = (await checkWhichNFT()) as MintedData;
          setNftData(mintedData);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching mint status:", error);
        }
      }
    };

    fetchData();
  }, [isConnected, attackResult]);

  console.log("-----", defenderData)

  return (
    <>
      <div className="flex flex-col md:flex-row w-full justify-center">
        <div className="flex flex-col justify-center">
          <div className="text-center md:text-left space-x-2 space-y-2">
            <>
              <h1 className="text-3xl md:text-5xl pt-6 font-bold text-center text-white">
                READY YOUR SNOWBALL
              </h1>
              <div className="mt-6 w-full flex flex-col justify-center">
                <div className="w-full text-center font-sans">
                  <input
                    type="text"
                    value={defenderAddress}
                    onChange={handleChange}
                    placeholder="Enter Ethereum Address or ENS Name"
                    className="w-1/2 p-2 border border-gray-300 rounded mx-auto"
                  />
                  {!loading && defenderAddress && !isValidAddress(defenderAddress) && (
                    <p className="text-red-500">
                      Invalid address or ENS name
                    </p>
                  )}
                </div>
              </div>
              {!loading ? (
                <div className={`flex flex-col md:flex-row items-center mx-auto w-full py-6 px-4 md:px-8`}>
                  {/* Attacker */}
                  {nftData && (
                    <div className="flex flex-col items-center">
                      <h1 className="text-2xl text-white">You</h1>
                      <NFTDataDisplay nftData={nftData} attackComplete={attackComplete} isAttacker={true} attacking={attacking} />
                    </div>
                  )}

                  {!attacking && defenderData && (
                    <div className="flex flex-col relative rounded-md mx-auto">
                      <h1 className="text-6xl font-bold relative z-0 whitespace-nowrap text-white hidden md:block lg:block">VS</h1>
                      <div className="relative">
                        {defenderAddress && isValidAddress(defenderAddress) && defenderData && (
                          <Button
                            onClick={() => attackTarget(defenderAddress)}
                            text="Attack"
                            disabled={!defenderData}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {attacking && <Loading action="ATTACKING" size="sm" />}

                  {/* Defender */}
                  {defenderData ? (
                    <div className="flex flex-col items-center">
                      <h1 className="text-2xl text-white">Opponent</h1>
                      <NFTDataDisplay
                        nftData={defenderData}
                        attacking={attacking}
                        attackComplete={attackComplete}
                        attackResult={attackResult}
                        defenderAddress={defenderAddress}
                      />
                    </div>
                  ) :
                    <div className="flex flex-col items-center">
                      <h1 className="text-2xl text-white">Opponent</h1>
                      <NFTDataDisplay
                        nftData={defenderData}
                        attacking={attacking}
                        attackComplete={attackComplete}
                        attackResult={attackResult}
                        defenderAddress={defenderAddress}
                      />
                    </div>
                  }
                </div>
              ) : (
                <Loading />
              )}

            </>

            {attackComplete && attackResult !== 0 && (
              <AttackSummary setAttackComplete={setAttackComplete} attackResult={attackResult} damageAmount={damageAmount} />
            )}

          </div>
        </div>
      </div >
    </>
  );
};

// export default Fight;
export default dynamic(() => Promise.resolve(Fight), { ssr: false });