// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import "./lib/Base64.sol";

error Paused();
error AlreadyHasNFT();
error EnemyNeedsNFT();
error YouNeedAnNFT();
error CharacterMustHaveHP();

contract SnowDay is ERC721, Ownable {
    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
        uint256 defense;
        uint256 evade;
    }

    uint256 public nextTokenId = 1;
    bool public isGamePaused = false;

    CharacterAttributes[] defaultCharacters;

    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
    mapping(address => uint256) public nftHolders;

    //events
    event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
    event AttackComplete(uint256 atkAmount, uint256 playerHp);
    event MissedAttack(address attacker, address victim);
    event SuccessfulAttack(address attacker, address victim, uint256 damageAmount, uint256 victimHp);
    event NFTBurned(address victim, uint256 tokenId, address attacker);

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttack,
        uint256[] memory characterDefense,
        uint256[] memory characterEvade
    ) ERC721("Snowday", "PPS") {
        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    attackDamage: characterAttack[i],
                    defense: characterDefense[i],
                    evade: characterEvade[i]
                })
            );
        }
    }

    function claimNFT(uint256 _characterIndex) external {
        if (isGamePaused) revert Paused();
        if (balanceOf(msg.sender) > 0) revert AlreadyHasNFT();

        _mint(msg.sender, nextTokenId);

        // Map the tokenId => their character attributes.
        nftHolderAttributes[nextTokenId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].hp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage,
            defense: defaultCharacters[_characterIndex].defense,
            evade: defaultCharacters[_characterIndex].evade
        });

        nftHolders[msg.sender] = nextTokenId;
        nextTokenId++;
        emit CharacterNFTMinted(msg.sender, nextTokenId, _characterIndex);
    }

    function throwSnowball(address _victim) external {
        if (isGamePaused) revert Paused();
        if (balanceOf(msg.sender) == 0) revert YouNeedAnNFT();
        if (balanceOf(_victim) == 0) revert EnemyNeedsNFT();
        //request the number
        hit(_victim, msg.sender);
    }

    function hit(address _victim, address _attacker) internal {
        if (isGamePaused) revert Paused();
        if (balanceOf(_victim) == 0) revert EnemyNeedsNFT();

        uint256 nftTokenofAttacker = nftHolders[_attacker];
        uint256 nftTokenIdOfPlayer = nftHolders[_victim];
        CharacterAttributes storage attacker = nftHolderAttributes[nftTokenofAttacker];
        CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

        // Make sure the player has more than 0 HP.
        // if (player.hp == 0) revert CharacterMustHaveHP();

        //random number between 0 and 99
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _victim))) % 100;

        // Adjust the hit chance based on evade
        if (random > (50 - player.evade)) {
            emit MissedAttack(_attacker, _victim);
            //  console.log("Missed due to evasion");
            return;
        }

        // Calculate potential damage
        uint256 potentialDamage = random + attacker.attackDamage - player.defense;
        if (potentialDamage > player.hp) {
            _burn(nftTokenIdOfPlayer);
            emit NFTBurned(_victim, nftTokenIdOfPlayer, _attacker);
            // console.log("Player has been burned");
            // console.log("Balance of Victim: %s", balanceOf(_victim));
        } else {
            player.hp = player.hp - potentialDamage;
            // console.log("Attack Damage", attacker.attackDamage, random) ;
            // console.log("Player attacked enemy. New Enemy hp is: %s\n", player.hp);
            emit SuccessfulAttack(_attacker, _victim, potentialDamage, player.hp);
        }
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);
        string memory strDefense = Strings.toString(charAttributes.defense);

        // Ensure that the JSON is correctly formatted
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        charAttributes.name,
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "The Pudgy Snowball Game!", "image": "',
                        charAttributes.imageURI,
                        '", "attributes": [ {"trait_type": "Health Points", "value": ',
                        strHp,
                        ', "max_value": ',
                        strMaxHp,
                        '}, {"trait_type": "Attack Damage", "value": ',
                        strAttackDamage,
                        '}, {"trait_type": "Defense", "value": ',
                        strDefense,
                        "}]}"
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function checkIfUserNFT(address _holder) public view returns (CharacterAttributes memory) {
        uint256 userNftTokenId = nftHolders[_holder];
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        }
        else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function checkIfTargetHasNFT(address _holder) public view returns (bool) {
        if (balanceOf(_holder) > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
        return defaultCharacters;
    }

    

    function getCharacterStats(uint256 _tokenId) external view returns (CharacterAttributes memory) {
        return nftHolderAttributes[_tokenId];
    }

    function getCharacterHp(uint256 _tokenId) public view returns (uint256) {
        return nftHolderAttributes[_tokenId].hp;
    }

    // Only Owner Functions
    function addCharacter(
        string memory _name,
        string memory _imageURI,
        uint256 _hp,
        uint256 _attack,
        uint256 _defense,
        uint256 _evade
    ) external onlyOwner {
        defaultCharacters.push(
            CharacterAttributes({
                characterIndex: defaultCharacters.length,
                name: _name,
                imageURI: _imageURI,
                hp: _hp,
                maxHp: _hp,
                attackDamage: _attack,
                defense: _defense,
                evade: _evade
            })
        );
    }

    function updateCharacterName(uint256 _characterIndex, string memory _newName) external onlyOwner() {
        defaultCharacters[_characterIndex].name = _newName;
    }

    function updateCharacterImageURI(uint256 _characterIndex, string memory _newImageURI) external onlyOwner {
        defaultCharacters[_characterIndex].imageURI = _newImageURI;
    }

    function updateCharacterHp(uint256 _characterIndex, uint256 _newHp) external onlyOwner {
        defaultCharacters[_characterIndex].maxHp = _newHp;
    }

    function updateCharacterAttack(uint256 _characterIndex, uint256 _newAttack) external onlyOwner {
        defaultCharacters[_characterIndex].attackDamage = _newAttack;
    }

    function updateCharacterDefense(uint256 _characterIndex, uint256 _newDefense) external onlyOwner {
        defaultCharacters[_characterIndex].defense = _newDefense;
    }

    function updateCharacterEvade(uint256 _characterIndex, uint256 _newEvade) external onlyOwner {
        defaultCharacters[_characterIndex].evade = _newEvade;
    }

    function startGame() external onlyOwner {
        isGamePaused = false;
    }

    function stopGame() external onlyOwner {
        isGamePaused = true;
    }
}
