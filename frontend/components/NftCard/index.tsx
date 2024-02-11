import React, { useEffect, useLayoutEffect, useState } from 'react';

interface NftData {
  imageURI: string;
  name: string;
  hp: number;
  attackDamage: number;
  defense: number;
  evade: number;
}

interface NftCardProps {
  nftData: NftData | null;
  attacking?: boolean;
  attackComplete?: boolean;
  attackResult?: number;
  defenderAddress?: string;
  isAttacker?: boolean;
}

const NftCard: React.FC<NftCardProps> = ({
  nftData,
  attacking,
  attackComplete,
  attackResult,
  defenderAddress,
  isAttacker
}) => {
  const [frozen, setFrozen] = useState(true);
  const [message, setMessage] = useState<string>("");

  useLayoutEffect(() => {
    if (nftData && nftData?.hp === 0 || attackResult === 3) {
      // Apply the frozen effect immediately upon loading
      setFrozen(true);
    } else {
      setFrozen(false);
    }
  }, [nftData?.hp, attackResult]);

  useEffect(() => {
    if (defenderAddress && !nftData?.name) {
      setMessage("Opponent has no NFT")
    } else if (!defenderAddress && !nftData?.name) {
      setMessage("Set address to select opponent")
    }
  }, [defenderAddress])

  return (
    <div className={`nft-data-container relative text-white rounded-md w-2/3 border-2 border-gray-400 ${attacking && !isAttacker && "transition-transform hover:transform animate-shake-slow"} ${isAttacker && attacking ? "slingshot" : ""} ${attackComplete ? 'opacity-20' : ''}`}>
      <div className="relative">
        <h3 className="text-4xl text-center font-black mb-4 text-white absolute top-0 left-0 px-4 shadow-md">
          {nftData?.name || message}
        </h3>
        <img
          src={nftData?.imageURI || "https://wallpapers.com/images/hd/black-padlock-symbol-lock-screen-dsxadlavdbgejbos.jpg"}
          alt={nftData?.name || "No NFT image"}
          className={`w-full h-auto max-h-[75vh] rounded-t-md ${frozen && "blur-md"}`}
        />
        <div>
          {frozen && <div className="overlay flex items-center">
            <div className="flex flex-col text-center">
              <p className="text-red-700 font-black text-2xl">OPPONENT FROZEN</p>
              <p className="text-2xl">They have left the game</p>
            </div>
          </div>}
        </div>
      </div>
      {nftData && (
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gray-400 bg-opacity-80 ${frozen && "blur-md"}`}>
          <div className="nft-data-text text-left">
            <p className="text-black">Health: {nftData.hp.toString()}</p>
            <p className="text-black">Attack: {nftData.attackDamage.toString()}</p>
            <p className="text-black">Defense: {nftData.defense.toString()}</p>
            <p className="text-black">Evade: {nftData.evade.toString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NftCard;
