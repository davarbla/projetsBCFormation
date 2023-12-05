// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";

error UserHasAlreadyPlayed(address user);
error GameFinished();
error OwnerCannotGuess();
error EmptyWordString();

contract GuessAndWin is Ownable {

    string private word;
    string private indication;
    address winner;
    mapping(address => bool) hasPlayed;

    // Reset
    address[] private players;
    
    event GameWon(address indexed _winner);
    event GameReset();

    constructor() Ownable(msg.sender) {

    }

    function guess(string memory _word) external returns(bool) {
        // require(msg.sender != owner(), "The owner cannot play");
        if(isEqual(word, "")) {
            revert EmptyWordString();
        }
        if(hasPlayed[msg.sender]) {
            revert UserHasAlreadyPlayed(msg.sender);
        }
        if(winner != address(0)) {
            revert GameFinished();
        }
        if(msg.sender == owner()) {
            revert OwnerCannotGuess();
        }
        if(isEqual(word, _word)) {
            winner = msg.sender;
            hasPlayed[msg.sender] = true;
            players.push(msg.sender);
            emit GameWon(msg.sender);
            return true;
        }
        hasPlayed[msg.sender] = true;
        players.push(msg.sender);
        return false;
    }

    function setWordAndIndication(string memory _word, string memory _indication) 
    external onlyOwner {
        word = _word;
        indication = _indication;
    }

    function reset() external onlyOwner {
        word = "";
        indication = "";
        winner = address(0);
        for(uint256 i = 0 ; i < players.length ; i++) {
            hasPlayed[players[i]] = false;
        }
        delete players;

        emit GameReset();
    }

    function isEqual(string memory _string1, string memory _string2) 
    private pure returns(bool) {
        return keccak256(abi.encodePacked(_string1)) == keccak256(abi.encodePacked(_string2));
    }

    function getIndication() external view returns(string memory) {
        return indication;
    }

    function getWinner() external view returns(address) {
        return winner;
    }
}