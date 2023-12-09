// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SnowDay.sol";

contract NFTAttack is RrpRequesterV0, Ownable, SnowDay {
    address public airnode;
    bytes32 public endpointIdUint256;
    address public sponsorWallet;

    uint256 public randomInRange;

    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;
    mapping(bytes32 => address[2]) whoToHit;

    event RequestUint256(bytes32 indexed requestId);
    event ReceivedUint256(bytes32 indexed requestId, uint256 response);

    constructor(
        address _airnodeRrp,
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttack,
        uint256[] memory characterDefense,
        uint256[] memory characterEvade
    )
        RrpRequesterV0(_airnodeRrp)
        SnowDay(characterNames, characterImageURIs, characterHp, characterAttack, characterDefense, characterEvade)
    {}

    function setRequestParameters(address _airnode, bytes32 _endpointIdUint256, address _sponsorWallet) external {
        airnode = _airnode;
        endpointIdUint256 = _endpointIdUint256;
        sponsorWallet = _sponsorWallet;
    }

    function throwSnowball(address _victim) external {
        if (isGamePaused) revert Paused();
        if (balanceOf(msg.sender) == 0) revert YouNeedAnNFT();
        if (balanceOf(_victim) == 0) revert EnemyNeedsNFT();
        //request the number
        //hit(_victim, msg.sender);
        makeRequestUint256(_victim, msg.sender);
    }

    function hit(address _victim, address _attacker, uint256 _random) internal {
        if (isGamePaused) revert Paused();
        if (balanceOf(_victim) == 0) revert EnemyNeedsNFT();

        uint256 nftTokenofAttacker = nftHolders[_attacker];
        uint256 nftTokenIdOfPlayer = nftHolders[_victim];
        CharacterAttributes storage attacker = nftHolderAttributes[nftTokenofAttacker];
        CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

        // Make sure the player has more than 0 HP.
        // if (player.hp == 0) revert CharacterMustHaveHP();

        // Adjust the hit chance based on evade
        if (_random > (50 - player.evade)) {
            emit MissedAttack(_attacker, _victim);
            //  console.log("Missed due to evasion");
            return;
        }

        // Calculate potential damage
        uint256 potentialDamage = _random + attacker.attackDamage - player.defense;
        if (potentialDamage > player.hp) {
            _burn(nftTokenIdOfPlayer);
            emit NFTBurned(_victim, nftTokenIdOfPlayer, _attacker);
            // console.log("Player has been burned");
            // console.log("Balance of Victim: %s", balanceOf(_victim));
        } else {
            player.hp = player.hp - potentialDamage;
            // console.log("Attack Damage", attacker.attackDamage, _random) ;
            // console.log("Player attacked enemy. New Enemy hp is: %s\n", player.hp);
            emit SuccessfulAttack(_attacker, _victim, potentialDamage, player.hp);
        }
    }

    function makeRequestUint256(address _victim, address _attacker) public {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode, endpointIdUint256, address(this), sponsorWallet, address(this), this.fulfillUint256.selector, ""
        );
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        //tag the request with the victim
        whoToHit[requestId] = [_victim, _attacker];
        emit RequestUint256(requestId);
    }

    function fulfillUint256(bytes32 requestId, bytes calldata data) external onlyAirnodeRrp {
        require(expectingRequestWithIdToBeFulfilled[requestId], "Request ID not known");
        expectingRequestWithIdToBeFulfilled[requestId] = false;
        uint256 qrngUint256 = abi.decode(data, (uint256));
        // Convert the uint256 to a number in the range 1-100
        randomInRange = (qrngUint256 % 100) + 1;
        hit(whoToHit[requestId][0], whoToHit[requestId][1], randomInRange);
        emit ReceivedUint256(requestId, qrngUint256);
    }

    function withdraw() external {
        airnodeRrp.requestWithdrawal(airnode, sponsorWallet);
    }
}