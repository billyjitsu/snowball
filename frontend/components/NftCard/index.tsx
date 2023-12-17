import React from 'react'

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
      <div className="nft-data-container flex flex-col items-center">
        <img
          src={nftData.imageURI}
          alt={nftData.name}
          className="w-1/2 h-auto"
        />
        <div className="nft-data-text mt-1 text-center">
          <h3 className="text-2xl font-bold">
            {nftData.name}
          </h3>
          <p className="text-sm">
            Health: {nftData.hp.toString()}
          </p>
          <p className="text-sm">
            Attack: {nftData.attackDamage.toString()}
          </p>
          <p className="text-sm">
            Defense: {nftData.defense.toString()}
          </p>
          <p className="text-sm">
            Evade: {nftData.evade.toString()}
          </p>
        </div>
      </div>
    );
  };
  

export default NftCard