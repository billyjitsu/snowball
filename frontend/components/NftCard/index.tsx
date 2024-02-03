import React from 'react';

interface NftData {
  imageURI: string;
  name: string;
  hp: number;
  attackDamage: number;
  defense: number;
  evade: number;
}

interface NftCardProps {
  nftData: NftData;
}

const NftCard: React.FC<NftCardProps> = ({ nftData }) => {
  if (!nftData) {
    return null; // or some loading indicator
  }

  return (
    <div className="nft-data-container relative text-white rounded-md w-2/3 border-2 border-gray-400">
      <div className="relative">
        <h3 className="text-4xl text-center font-black mb-4 text-white absolute top-0 left-0 p-4 shadow-md">
          {nftData.name}
        </h3>
        <img
          src={nftData.imageURI}
          alt={nftData.name}
          className={`w-full h-auto max-h-[90vh] rounded-t-md`}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-400 bg-opacity-80">
        <div className="nft-data-text text-left">
          <p className="text-black">
            Description: {"This is a description of the NFT"}
          </p>
          <p className="text-black">
            Health: {nftData.hp.toString()}
          </p>
          <p className="text-black">
            Attack: {nftData.attackDamage.toString()}
          </p>
          <p className="text-black">
            Defense: {nftData.defense.toString()}
          </p>
          <p className="text-black">
            Evade: {nftData.evade.toString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
