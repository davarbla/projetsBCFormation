// SPDX-License-Identifier: MIT
//2E.Votre smart contract doit utiliser la dernière version du compilateur.
pragma solidity 0.8.23;

//7E.Votre smart contract doit importer le smart contract la librairie “Ownable” d’OpenZepplin.
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
//console.log("example log");

//1E.Votre smart contract doit s’appeler “Voting”/"VotingPlus". 
contract Voting is Ownable {
constructor() Ownable(msg.sender) {
}
//4Ea.Votre smart contract doit définir les structures de données suivantes : Voter
struct Voter {
bool isRegistered;
bool hasVoted;
uint votedProposalId;
}

//4Eb.Votre smart contract doit définir les structures de données suivantes : Proposal
struct Proposal {
string description;
uint voteCount;
}

//5E.Votre smart contract doit définir une énumération qui gère les différents états d’un vote
enum WorkflowStatus {
RegisteringVoters,
ProposalsRegistrationStarted,
ProposalsRegistrationEnded,
VotingSessionStarted,
VotingSessionEnded,
VotesTallied
}

//6E.Votre smart contract doit définir un uint winningProposalId qui représente l’id du gagnant ou une fonction getWinner qui retourne le gagnant.
uint private winningProposalId;

//8E.Votre smart contract doit définir les événements suivants : 
event VoterRegistered(address voterAddress); 
event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
event ProposalRegistered(uint proposalId);
event Voted (address voter, uint proposalId);

}