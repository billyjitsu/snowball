# SnowDay & NFTAttack Contracts

## Overview
These Solidity contracts are designed for a blockchain-based game where players can mint, hold, and use NFTs (Non-Fungible Tokens) to engage in a game. The `SnowDay` contract handles the NFT aspects, including minting and tracking character attributes. The `NFTAttack` contract extends the functionality of `SnowDay` by allowing NFTs to interact in a game environment, including mechanics for attacking and defending.

## SnowDay Contract

### Key Features
- **NFT Minting**: Allows players to mint character NFTs with unique attributes.
- **Game States**: Manages different states of the game like paused, in progress, and ended.
- **Character Attributes**: Each NFT has attributes like HP, attack damage, defense, etc.
- **Ownership and Access Control**: Utilizes OpenZeppelin's `Ownable` for owner-specific functions.

### Functions
- `startTheGame()`: Starts the game, setting up the necessary state.
- `endTheGame()`: Ends the game.
- `claimNFT(uint256 _characterIndex)`: Allows a user to mint a character NFT.
- `tokenURI(uint256 _tokenId)`: Returns the URI for a token's metadata.
- `addCharacter(...)`, `updateCharacterName(...)`, etc.: Functions for the owner to manage character attributes.
- `pauseGameToggle()`: Allows the owner to pause/unpause the game.

### Events
- `CharacterNFTMinted`: Emitted when a new character NFT is minted.
- Other events related to the game state and character interactions.

## NFTAttack Contract

### Key Features
- Extends `SnowDay` with additional game mechanics.
- Integrates with `@api3/airnode-protocol` for external data requests.
- Implements attack logic where NFTs can attack each other.
- Manages yield and gas claim mechanics using the Blast network.

### Functions
- `startGame()`, `endGame()`: Start and end the game, respectively.
- `enterTheArena(uint256 _characterIndex)`: Allows a player to enter the game by minting an NFT.
- `throwSnowball(address _victim)`: Initiates an attack on another player's NFT.
- `hit(address _victim, address _attacker, uint256 _random)`: Internal function to execute an attack.
- `makeRequestUint256(...)`, `fulfillUint256(...)`: Functions to handle external data requests.
- `claimYourPrize()`: Allows players to claim their prizes post-game.
- `calculatePayout()`: Calculates the payout for winners.
- `withdrawContractFunds()`: Withdraws funds from the contract.
- `claimGasUsedByContract()`, `getYieldOnContract()`: Functions related to the Blast network for gas and yield management.

### Events
- `RequestUint256`, `ReceivedUint256`: Emitted during the external data request process.
- Other events related to game mechanics like attacks and prize claiming.

## Error Handling
Both contracts use custom error messages for various fail states, improving the debugging process and user experience.

## Requirements
- Solidity ^0.8.10.
- OpenZeppelin Contracts for ERC721, Ownable, and Strings utilities.
- Hardhat for development and testing.
- API3's Airnode protocol for off-chain data requests.

## Security Considerations
- Ensure proper testing and auditing, especially for functions that handle ETH transactions and NFT minting.
- Be cautious with external calls and data requests to avoid vulnerabilities.



1. **Contract Address:**
   - [0xBA18f2DC2Ce0B971f33236fdf76E227bf9D8dDBd](https://goerli.basescan.org/address/0xba18f2dc2ce0b971f33236fdf76e227bf9d8ddbd)

2. **Sponsor Wallet:**
   - [0x6c33312c753cAc450fD800D297E019135895bc0B](https://goerli.basescan.org/address/0x6c33312c753cAc450fD800D297E019135895bc0B)

3. **APE Coin:**
   - [0xb8EAa40a7976474a47bB48291FE569f383069FBc](https://goerli.basescan.org/address/0xb8eaa40a7976474a47bb48291fe569f383069fbc)

