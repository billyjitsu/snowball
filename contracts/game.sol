// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import "./lib/Base64.sol";

contract Game is ERC721{
  // We'll hold our character's attributes in a struct. Feel free to add
  // whatever you'd like as an attribute! (ex. defense, crit chance, etc).
  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;        
    uint hp;
    uint maxHp;
  }

  uint public nextCharacterId = 1;

//  using Counters for Counters.Counter;
//  Counters.Counter private _tokenIds;
  // A lil array to help us hold the default data for our characters.
  // This will be helpful when we mint new characters and need to know
  // things like their HP, AD, etc.
  CharacterAttributes[] defaultCharacters;

  // We create a mapping from the nft's tokenId => that NFTs attributes.
  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
  // A mapping from an address => the NFTs tokenId. Gives me an ez way
  // to store the owner of the NFT and reference it later.
  mapping(address => uint256) public nftHolders;

  //events
  event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
  event AttackComplete(uint newBossHp, uint newPlayerHp);

  // Data passed in to the contract when it's first created initializing the characters.
  // We're going to actually pass these values in from from run.js.
  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp
  ) ERC721("Heroes", "HERO")
  {
    
    // Loop through all the characters, and save their values in our contract so
    // we can use them later when we mint our NFTs.
    for(uint i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(CharacterAttributes({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i],
        hp: characterHp[i],
        maxHp: characterHp[i]
      }));

      CharacterAttributes memory c = defaultCharacters[i];
      console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
    }
     //placed here to start value at 1 instead of 0
  //  _tokenIds.increment();
  }

  function mintCharacterNFT(uint _characterIndex) external {
    // Get current tokenId (starts at 1 since we incremented in the constructor).
   // uint256 newItemId = _tokenIds.current();

    // The magical function! Assigns the tokenId to the caller's wallet address.
 //   _safeMint(msg.sender, newItemId);

    // We map the tokenId => their character attributes. More on this in
    // the lesson below.
    // nftHolderAttributes[newItemId] = CharacterAttributes({
    //   characterIndex: _characterIndex,
    //   name: defaultCharacters[_characterIndex].name,
    //   imageURI: defaultCharacters[_characterIndex].imageURI,
    //   hp: defaultCharacters[_characterIndex].hp,
    //   maxHp: defaultCharacters[_characterIndex].hp,
    //   attackDamage: defaultCharacters[_characterIndex].attackDamage
    // });

 //   console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);
    
    // Keep an easy way to see who owns what NFT.
  //  nftHolders[msg.sender] = newItemId;

    // Increment the tokenId for the next person that uses it.
  //  _tokenIds.increment();

    //emit event
 //   emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
  }


  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

    string memory strHp = Strings.toString(charAttributes.hp);
    string memory strMaxHp = Strings.toString(charAttributes.maxHp);

    string memory json = Base64.encode(
     bytes(
      string(
        abi.encodePacked(
          '{"name": "', charAttributes.name, ' -- NFT #: ', Strings.toString(_tokenId),
          '", "description": "The Pudgy Snowball Game!", "image": "', charAttributes.imageURI,
          '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}]}'
        )
      )
     )
    );

   string memory output = string(
     abi.encodePacked("data:application/json;base64,", json)
    );
  
   return output;
  }

    // function attackBoss() public {
    //     // Get the state of the player's NFT.
    //     uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
    //     CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];  //storage used to make sure its global on NFT , not the function
    //     console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
    //     console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);
    //     // Make sure the player has more than 0 HP.
    //     require(player.hp > 0, "Error: Character must have HP to attack boss.");
    //     // Make sure the boss has more than 0 HP.
    //     require(bigBoss.hp > 0, "Error: Boss must have HP to be attacked");
    //     // Allow player to attack boss.
    //     if(bigBoss.hp < player.attackDamage) {
    //         bigBoss.hp = 0;
    //     } else {
    //         bigBoss.hp = bigBoss.hp - player.attackDamage;
    //     }
    //     // Allow boss to attack player.
    //     if (player.hp < bigBoss.attackDamage) {
    //          player.hp = 0;
    //     } else {
    //         player.hp = player.hp - bigBoss.attackDamage;
    //     }
    //     console.log("Boss attacked player. New Player hp is: %s\n", player.hp);

    //     //emit event
    //     emit AttackComplete(bigBoss.hp, player.hp);
    // }

    function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
        // Get the token id of wallet
        uint256 userNftTokenId = nftHolders[msg.sender];
        // If the user has a tokenId in the map, return their character
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        }
        //Else, return and empty character
        else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
     return defaultCharacters;
    }

}