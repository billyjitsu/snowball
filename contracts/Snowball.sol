// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**

 */
contract SnowDay is ERC1155Burnable, Ownable {

    event NewPlayer(address indexed account, uint256 level);
    // event Miaowed(address indexed attacker, address indexed victim, uint256 level);

    bool public isGamePaused = false;

    struct NFTData {
        uint256 health;
        string imageURI;
    }

    mapping(uint256 => NFTData) public tokenData;


    constructor(string memory _uri) ERC1155(_uri)
    {}

    function claimPenguin() external {
        require(isGamePaused == false, "GAME_PAUSED");
        require(balanceOf(msg.sender, 1) == 0, "Already has a penguin");
        _mint(msg.sender, 1, 1, "");
        tokenData[1] = NFTData({
        health: 100,
        imageURI: "initialURI"
        });
        // claiming a Penguine enters the game at level 1
        emit NewPlayer(msg.sender, 1);
    }

    function killPenguin(address _enemy) external {
        require(isGamePaused == false, "GAME_PAUSED");
        require(balanceOf(msg.sender, 1) > 0, "You need a penguin to knockout!");
        require(balanceOf(_enemy, 1) > 0, "Enemy needs a penguin to hit!");
        _burn(_enemy, 1, 1);
    }

    function throwSnowball(address _victim) external {
        require(isGamePaused == false, "GAME_PAUSED");
        require(balanceOf(msg.sender, 1) > 0, "You need a penguin to throw a snowball!");
        require(balanceOf(_victim, 1) > 0, "Enemy needs a penguin to hit!");
        hit(_victim);  
    }

    function hit(address _victim) internal {
        require(isGamePaused == false, "GAME_PAUSED");
        require(balanceOf(msg.sender, 1) > 0, "You need a penguin to hit!");
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _victim))) % 100;
        if(random < 50) {
            // hit
            // _burn(_victim, 1, 1);
        } else {
            // miss
            // _burn(msg.sender, 1, 1);
        }  
    }

    /** 
     * @notice Burn a penguin to level up
     */
    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint256 id,
    //     uint256 amount,
    //     bytes memory data
    // ) public override gameNotPaused {
    //     // can only transfer kittens
    //     require(id == 0, "This cat is not transferable!");
    //     super.safeTransferFrom(from, to, id, amount, data);
    //     if(from != to && id == 0) {
    //         // transfering level 1 NFT gives you a level 2 NFT
    //         _mint(from, 1, 1, "");
    //         emit LevelUp(to, 1); // receiver levels up to 1
    //         emit LevelUp(from, 2); // sender levels up to 2
    //     }
    // }

    /** 
     * @notice Burn a cat to either level up or attack another cat
     */
    // function burn(
    //     address account,
    //     uint256 id,
    //     uint256 amount
    // ) external override gameNotPaused {
    //     // the owner can burn their NFT, but any ninja cat owner can also burn anyone else's NFT
    //     require(msg.sender == account || balanceOf[msg.sender][2] > 0, "NOT_TOKEN_OWNER or ninja cat");
    //     _burn(account, id, amount);
    //     if(id == 1) {
    //         // burning level 2 NFT gives you a level 3 NFT
    //         _mint(account, 2, 1, "");
    //         emit LevelUp(account, 3);
    //     }
    // }

    /**
     * @notice Lets a Ninja cat owner attack another user's to burn their cats
     */
    // function attack(address victim) external gameNotPaused {
    //     address attacker = msg.sender;
    //     // only a ninja cat owner can attack
    //     require(balanceOf[attacker][2] > 0, "You need a ninja cat to attack!");
    //     // find which cat the victim ha
    //     uint256 tokenToBurn = 0;
    //     if(balanceOf[victim][0] > 0) {
    //         tokenToBurn = 0;
    //     } else if(balanceOf[victim][1] > 0) {
    //         tokenToBurn = 1;
    //     } else if(balanceOf[victim][2] > 0) {
    //         tokenToBurn = 2;
    //     } else {
    //         revert("Victim has no cat!");
    //     }
    //     // burn it
    //     _burn(victim, tokenToBurn, 1);
    //     // mint a badge of honor to the attacker
    //     _mint(attacker, 3, 1, "");
    //     emit Miaowed(msg.sender, victim, tokenToBurn + 1);
    // }

    // function getScore(address player) public view returns(uint256) {
    //     // Kitten: 1 point
    //     // Grumpy cat: 2 points
    //     // Ninja cat: 3 points
    //     // Badge of honor: 1 point
    //     return balanceOf[player][0] + 2 * balanceOf[player][1] + 3 * balanceOf[player][2] + balanceOf[player][3];
    // }

    // URI overide for number schemes
    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked("imageURI", Strings.toString(_tokenId), ".json")
            );
    }

    function name() public pure returns (string memory) {
        return "Snow Day";
    }

    function symbol() public pure returns (string memory) {
        return "Pengu";
    } 
    
    /** 
     * @notice Lets the owner restart the game
     */
    function startGame() external {
        require(msg.sender == owner(), "Only owner can start the game");
        isGamePaused = false;
    }

    /** 
     * @notice Lets the owner pause the game
     */
    function stopGame() external {
        require(msg.sender == owner(), "Only owner can stop the game");
        isGamePaused = true;
    }

    modifier gameNotPaused() {
        require(!isGamePaused, "Game is paused");
        _;
    }
}