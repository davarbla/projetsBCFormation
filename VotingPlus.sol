// SPDX-License-Identifier: MIT
//2E.Votre smart contract doit utiliser la derni�re version du compilateur.
pragma solidity 0.8.23;

//7E.Votre smart contract doit importer le smart contract la librairie �Ownable� d�OpenZepplin.
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

//1E.Votre smart contract doit s�appeler �VotingPlus�.
contract VotingPlus is Ownable {
    //3A.L�administrateur est celui qui va d�ployer le smart contract.
    constructor() Ownable(msg.sender) {}

    //4Ea.Votre smart contract doit d�finir les structures de donn�es suivantes : Voter
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    //4Eb.Votre smart contract doit d�finir les structures de donn�es suivantes : Proposal
    struct Proposal {
        string description;
        uint voteCount;
    }

    //5E.Votre smart contract doit d�finir une �num�ration qui g�re les diff�rents �tats d�un vote
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    //6E.Votre smart contract doit d�finir un uint winningProposalId qui repr�sente l�id du gagnant ou une fonction getWinner qui retourne le gagnant.
    uint private winningProposalId;

    //8E.Votre smart contract doit d�finir les �v�nements suivants :
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    //Impl�mentation
    mapping(address => bool) public mapWhitelist;
    uint mapWhitelistSize;

    event ShowCounter(uint);
    event ShowScore(uint);

    // Mapping des voteurs
    mapping(address => Voter) public mapVoters;

    // Array des propositions
    Proposal[] public arrProposals;

    WorkflowStatus public VotingStatus;

    modifier checkWorflowStatus(WorkflowStatus _status) {
        require(
            VotingStatus == _status,
            "Current vote status doesn't allow this action !!!"
        );
        _;
    }

    // 1P. L'administrateur du vote enregistre une liste blanche d'�lecteurs identifi�s par leur adresse Ethereum.
    function st1RegisterVoter(address _voterAddress) public onlyOwner {
        require(
            VotingStatus == WorkflowStatus.RegisteringVoters,
            "Previous voting status must be Registering Voters !!!"
        );
        require(
            !mapWhitelist[_voterAddress],
            "This voter is already registered"
        );
        mapWhitelist[_voterAddress] = true;
        mapVoters[_voterAddress].isRegistered = true;
        mapWhitelistSize++;
        emit VoterRegistered(_voterAddress);
        console.log(
            string(
                abi.encodePacked(
                    "+++++++++ (1) Voter registered:",
                    _voterAddress,
                    "+++++++"
                )
            )
        );
    }

    // 2P. L'administrateur du vote commence la session d'enregistrement de la proposition.
    function st2RegisterPropositionsSt2() public onlyOwner {
        require(
            VotingStatus == WorkflowStatus.RegisteringVoters,
            "Please register voters before !!!"
        );
        require(mapWhitelistSize > 0, "Please register voters before !!!");
        VotingStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            VotingStatus
        );
        console.log(
            "********* (2) Vote Propositions Registration STARTED ************"
        );
    }

    // 3P. Les �lecteurs inscrits sont autoris�s � enregistrer leurs propositions pendant que la session d'enregistrement est active.
    function st3addProposal(
        string memory _description
    ) public checkWorflowStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        require(
            mapWhitelist[msg.sender],
            "You must be registered to add a proposal !!!"
        );

        bool proposalExists = findProposal(arrProposals, _description); // V�rification propositions en doublon
        if (proposalExists == false) {
            arrProposals.push(Proposal(_description, 0));
            uint proposalIndex = arrProposals.length - 1;
            emit ProposalRegistered(proposalIndex);
            console.log(
                string(
                    abi.encodePacked(
                        "+++++++++ (3) New proposal succesfully added: ",
                        _description,
                        " +++++++"
                    )
                )
            );
        } else {
            console.log(
                "------- (3) Proposal already added previously -------"
            );
        }
    }

    function compareStrings(
        string memory firstString,
        string memory secondString
    ) internal pure returns (bool) {
        return keccak256(bytes(firstString)) == keccak256(bytes(secondString));
    }

    function findProposal(
        Proposal[] storage array,
        string memory _string
    ) internal view returns (bool) {
        for (uint i = 0; i < array.length; i++) {
            string memory stringToFind = array[i].description;
            bool exists = compareStrings(stringToFind, _string);
            if (exists == true) {
                return true;
            }
        }
        return false;
    }

    function showProposals(Proposal[] storage array) internal view {
        for (uint i = 0; i < array.length; i++) {
            console.log(
                string(
                    abi.encodePacked(
                        "Vote : ",
                        Strings.toString(i),
                        " for ",
                        array[i].description
                    )
                )
            );
        }
    }

    // 4P. L'administrateur de vote met fin � la session d'enregistrement des propositions.
    function st4setProposalsRegistrationEnded()
        public
        onlyOwner
        checkWorflowStatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        VotingStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            VotingStatus
        );
        console.log(
            "********* (4) Vote Propositions Registration CLOSED ************"
        );
    }

    // 5P.L'administrateur du vote commence la session de vote.
    function st5setVotingSessionStarted()
        public
        onlyOwner
        checkWorflowStatus(WorkflowStatus.ProposalsRegistrationEnded)
    {
        VotingStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            VotingStatus
        );
        console.log("********* (5) Vote Session STARTED ************");
        console.log(" Please vote: ");
        showProposals(arrProposals);
    }

    // 6P.Les �lecteurs inscrits votent pour leur proposition pr�f�r�e.
    function st6addMyVote(
        uint _proposalNumber
    ) public checkWorflowStatus(WorkflowStatus.VotingSessionStarted) {
        require(
            mapWhitelist[msg.sender],
            "This voter is not registered for voting !!!"
        );
        require(
            !mapVoters[msg.sender].hasVoted,
            "This voter has already voted !"
        );
        require(
            _proposalNumber < arrProposals.length,
            "The vote number doesn't exist !!!"
        );

        arrProposals[_proposalNumber].voteCount++;
        mapVoters[msg.sender].hasVoted = true;
        mapVoters[msg.sender].votedProposalId = _proposalNumber;
        emit Voted(msg.sender, _proposalNumber);
        console.log(
            string(
                abi.encodePacked(
                    "+++++++++ (6) Voter: ",
                    msg.sender,
                    " has voted +++++++"
                )
            )
        );
    }

    // 7P. L'administrateur du vote met fin � la session de vote.
    function st7setVotingSessionEnded()
        public
        onlyOwner
        checkWorflowStatus(WorkflowStatus.VotingSessionStarted)
    {
        VotingStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            VotingStatus
        );
        console.log("********* (7) Vote Session CLOSED ************");
    }

    uint[] private arrVotes;
    uint[] public arrWinners;

    // 8P. L'administrateur du vote comptabilise les votes.
    function st8countVotes()
        public
        onlyOwner
        checkWorflowStatus(WorkflowStatus.VotingSessionEnded)
    {
        uint iVoteCounter = 0;

        for (uint i = 0; i < arrProposals.length; i++) {
            //On  r�cup�re les propositions avec votes
            if (arrProposals[i].voteCount >= iVoteCounter) {
                iVoteCounter = arrProposals[i].voteCount;
                winningProposalId = i;
                arrVotes.push(i);
            }
        }
        //Gestion des ex aequo (plusieurs propositions avec le score max )
        uint score = arrProposals[arrVotes.length].voteCount;
        for (uint i = 0; i < arrProposals.length; i++) {
            if (arrProposals[i].voteCount >= score) {
                score = arrProposals[i].voteCount;
                arrWinners.push(i);
            }
        }

        VotingStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            VotingStatus
        );
        console.log("********* (8) Votes Counted ************");
    }

    //9P. Tout le monde peut v�rifier les derniers d�tails de la proposition gagnante.
    function getWinner()
        public
        view
        checkWorflowStatus(WorkflowStatus.VotesTallied)
        returns (uint[] memory)
    {
        return arrWinners;
    }
}
