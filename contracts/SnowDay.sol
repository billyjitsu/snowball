// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import "./lib/Base64.sol";

contract SnowDay is ERC721, Ownable{
  
  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;        
    uint hp;
    uint maxHp;
  }

  uint public nextTokenId = 1;
  bool public isGamePaused = false;

  // A lil array to help us hold the default data for our characters.
  // This will be helpful when we mint new characters and need to know
  CharacterAttributes[] defaultCharacters;

  // We create a mapping from the nft's tokenId => that NFTs attributes.
  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
  // A mapping from an address => the NFTs tokenId. Gives me an ez way
  // to store the owner of the NFT and reference it later.
  mapping(address => uint256) public nftHolders;

  //events
  event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
  event AttackComplete(uint atkAmount, uint playerHp);

  // Data passed in to the contract when it's first created initializing the characters.
  // We're going to actually pass these values in from from run.js.
  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp
  ) ERC721("Snowday", "PPS")
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
  }

  function claimPenguin(uint _characterIndex) external {
    require(isGamePaused == false, "GAME_PAUSED");
    require( balanceOf(msg.sender) == 0, "Already has a penguin" );
  
    _mint(msg.sender, nextTokenId);

    // We map the tokenId => their character attributes. 
    nftHolderAttributes[nextTokenId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].hp
    });

   // console.log("Minted NFT w/ tokenId %s and characterIndex %s", nextTokenId, _characterIndex);
    
    // Keep an easy way to see who owns what NFT.
    nftHolders[msg.sender] = nextTokenId;

    nextTokenId++;

    //emit event
   emit CharacterNFTMinted(msg.sender, nextTokenId, _characterIndex);
  }

  function throwSnowball(address _victim) external {
        require(isGamePaused == false, "GAME_PAUSED");
        require(balanceOf(msg.sender) > 0, "You need a penguin to throw a snowball!");
        require(balanceOf(_victim) > 0, "Enemy needs a penguin to hit!");
        hit(_victim);  
  }

  function hit(address _victim) internal {
        require(isGamePaused == false, "GAME_PAUSED");
        require(balanceOf(_victim) > 0, "You need a penguin to hit!");

        uint256 nftTokenIdOfPlayer = nftHolders[_victim];
        CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

        // Make sure the player has more than 0 HP.
        require(player.hp > 0, "Error: Character must have HP to attack boss.");

        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _victim))) % 100;
        if(random < 50) {
          if(random > player.hp) {
            _burn(nftTokenIdOfPlayer);
            console.log("Player has been burned");
            console.log("Balance fo Victim: %s", balanceOf(_victim));
          } else {
            // hit
            player.hp = player.hp - random;
            console.log("Player attacked enemy. New Enemy hp is: %s\n", player.hp);
          }
        } else {
          console.log("Missed");
            // miss
        }  
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

    function addCharacter(string memory _name, string memory _imageURI, uint256 _hp) external onlyOwner {
        defaultCharacters.push(CharacterAttributes({
            characterIndex: defaultCharacters.length,
            name: _name,
            imageURI: _imageURI,
            hp: _hp,
            maxHp: _hp
        }));
    }

    function updateCharacterName(uint256 _characterIndex, string memory _newName) external {
        defaultCharacters[_characterIndex].name = _newName;
    }

    function updateCharacterImageURI(uint256 _characterIndex, string memory _newImageURI) external onlyOwner {
        defaultCharacters[_characterIndex].imageURI = _newImageURI;
    }

    function updateCharacterHp(uint256 _characterIndex, uint256 _newHp) external onlyOwner {
        defaultCharacters[_characterIndex].maxHp = _newHp;
    }

     /** 
     * @notice Lets the owner restart the game
     */
    function startGame() external onlyOwner{
        isGamePaused = false;
    }

    /** 
     * @notice Lets the owner pause the game
     */
    function stopGame() external onlyOwner{
        isGamePaused = true;
    }

    modifier gameNotPaused() {
        require(!isGamePaused, "Game is paused");
        _;
    }

}