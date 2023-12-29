const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const TEST_CONTRACT =  "Voting";
const WorkflowStatusRegisteringVoters = new BN(0);
const WorkflowStatusProposalsRegistrationStarted = new BN(1);
const WorkflowStatusProposalsRegistrationEnded = new BN(2);
const WorkflowStatusVotingSessionStarted = new BN(3);
const WorkflowStatusVotingSessionEnded = new BN(4);
const WorkflowStatusVotesTallie = new BN(5);

describe(`TEST OF THE SMART CONTRACT: ${TEST_CONTRACT}`, () =>  {
  let voting;

  beforeEach(async () => {
    [this.owner, this.voter1, this.unregisteredUser] = await ethers.getSigners();
    let contract = await ethers.getContractFactory(TEST_CONTRACT);
    voting = await contract.deploy();
  });

  // ::::::::::::: INITIALISATION ::::::::::::: //

  describe("1.INITIALIZATION", () => {
    it("Should have the right owner", async () => {
      let _owner = await voting.owner();
      expect(_owner).to.equal(this.owner.address);
    });

    it("Should have the winningProposalID variable equal to 0", async () => {
      let winningProposalID = await voting.winningProposalID();
      expect(winningProposalID).to.equal(0);
    });

    it("Should revert if voter adds voter", async () => {
      await expect(
        voting.connect(this.voter1).addVoter(this.voter1.address)).to.be.revertedWithCustomError(voting,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should revert if owner sets unathorized workflow status endProposalsRegistering", async () => {
        await expectRevert(
        voting.endProposalsRegistering(),
        "Registering proposals havent started yet"
      );
    });
    it("Should revert if owner sets unathorized workflow status", async () => {
      await expectRevert(
        voting.startVotingSession(),
        "Registering proposals phase is not finished"
      );
    });
    it("Should revert if owner sets unathorized workflow status endVotingSession", async () => {
      await expectRevert(
        voting.endVotingSession(),
        "Voting session havent started yet"
      );
    });
    it("Should revert if owner sets unathorized workflow status tallyVotes", async () => {
      await expectRevert(
        voting.tallyVotes(),
        "Current status is not voting session ended"
      );
    });

    it("Should revert if voter changes any workflow status startProposalsRegistering", async () => {
      await expect(
        voting.connect(this.voter1).startProposalsRegistering()).to.be.revertedWithCustomError(voting,
          "OwnableUnauthorizedAccount" 
      );
    });
    it("Should revert if voter changes any workflow status endProposalsRegistering", async () => {
      await expect(
        voting.connect(this.voter1).endProposalsRegistering()).to.be.revertedWithCustomError(voting,
          "OwnableUnauthorizedAccount" 
      );
    });
    it("Should revert if voter changes any workflow status startVotingSession", async () => {
      await expect(
        voting.connect(this.voter1).startVotingSession()).to.be.revertedWithCustomError(voting,
          "OwnableUnauthorizedAccount" 
      );
    }); 
    it("Should revert if voter changes any workflow status endVotingSession", async () => {
      await expect(
        voting.connect(this.voter1).endVotingSession()).to.be.revertedWithCustomError(voting,
          "OwnableUnauthorizedAccount" 
      );
    }); 
    it("Should revert if voter changes any workflow status tallyVotes", async () => {
      await expect(
        voting.connect(this.voter1).tallyVotes()).to.be.revertedWithCustomError(voting,
          "OwnableUnauthorizedAccount" 
      );
    });


    it("Should revert if going back to any previous worklow status", async () => {
      await voting.startProposalsRegistering();
      //Forward+1
      await voting.endProposalsRegistering();
      //Back
      await expectRevert(
        voting.startProposalsRegistering(),
        "Registering proposals cant be started now"
      );
      //Forward+1
      await voting.startVotingSession();
      //Back
      await expectRevert(
        voting.startProposalsRegistering(),
        "Registering proposals cant be started now"
      );
      //Back
      await expectRevert(
        voting.endProposalsRegistering(),
        "Registering proposals havent started yet"
      );
      //Forward+1
      await voting.endVotingSession();
      //Back
      await expectRevert(
        voting.startProposalsRegistering(),
        "Registering proposals cant be started now"
      );
      //Back
      await expectRevert(
        voting.endProposalsRegistering(),
        "Registering proposals havent started yet"
      );
      //Back
      await expectRevert(
        voting.startVotingSession(),
        "Registering proposals phase is not finished"
      );
      //Forward+1
      await voting.tallyVotes();
      //Back
      await expectRevert(
        voting.startProposalsRegistering(),
        "Registering proposals cant be started now"
      );
      //Back
      await expectRevert(
        voting.endProposalsRegistering(),
        "Registering proposals havent started yet"
      );
      //Back
      await expectRevert(
        voting.startVotingSession(),
        "Registering proposals phase is not finished"
      );
      //Back
      await expectRevert(
        voting.endVotingSession(),
        "Voting session havent started yet"
      );
    });


    it("Should revert if moving forward  to any unathorized forwarded worklow status is not allowed", async () => {
      await voting.startProposalsRegistering();
      //Forward++
      await expectRevert(
        voting.startVotingSession(),
        "Registering proposals phase is not finished"
      );
      //Forward++
      await expectRevert(
        voting.endVotingSession(),
        "Voting session havent started yet"
      );
      //Forward++
      await expectRevert(
        voting.tallyVotes(),
        "Current status is not voting session ended"
      );
      //Forward+1
      await voting.endProposalsRegistering();
           //Forward++
           await expectRevert(
            voting.endVotingSession(),
            "Voting session havent started yet"
          );
          //Forward++
          await expectRevert(
            voting.tallyVotes(),
            "Current status is not voting session ended"
          );
    
      //Forward+1
      await voting.startVotingSession();
            //Forward++
            await expectRevert(
              voting.tallyVotes(),
              "Current status is not voting session ended"
            );

    });

    it("Should Workflow steps: move forward status right step by step", async () => {
      await voting.startProposalsRegistering();
      let status = await voting.workflowStatus();
      expect(status).to.equal(WorkflowStatusProposalsRegistrationStarted);

      await voting.endProposalsRegistering();
      status = await voting.workflowStatus();
      expect(status).to.equal(WorkflowStatusProposalsRegistrationEnded);

      await voting.startVotingSession();
      status = await voting.workflowStatus();
      expect(status).to.equal(WorkflowStatusVotingSessionStarted);

      await voting.endVotingSession();
      status = await voting.workflowStatus();
      expect(status).to.equal(WorkflowStatusVotingSessionEnded);

      await voting.tallyVotes();
      status = await voting.workflowStatus();
      expect(status).to.equal(WorkflowStatusVotesTallie);

    });
  });
  

  // ::::::::::: REGISTER VOTERS ::::::::::: //

  describe("2.REGISTER VOTERS", () => {
    beforeEach(async () => {
      await voting.addVoter(this.owner.address); 
    });

    it("Should have workflow status: Registering Voters", async () => {
      let status = await voting.workflowStatus();
      expect(status).to.equal(WorkflowStatusRegisteringVoters);
    });

    it("Should return unregistered voter", async () => {
      let voter = await voting.getVoter(this.voter1.address);
      expect(voter.hasVoted).to.equal(false);
      expect(voter.isRegistered).to.equal(false);
      expect(voter.votedProposalId).to.equal(0);
    });

    it("Should Register voters", async () => {
      //Voter 1
      await expect(voting.addVoter(this.voter1.address))
        .to.emit(voting, "VoterRegistered")
        .withArgs(this.voter1.address);
      let voter1 = await voting.getVoter(this.voter1.address);
      expect(voter1.hasVoted).to.equal(false);
      expect(voter1.isRegistered).to.equal(true);
      expect(voter1.votedProposalId).to.equal(0);
      //Voter 2
      await expect(voting.addVoter(this.unregisteredUser.address))
        .to.emit(voting, "VoterRegistered")
        .withArgs(this.unregisteredUser.address);
      let unregisteredUser = await voting.getVoter(this.unregisteredUser.address);
      expect(unregisteredUser.hasVoted).to.equal(false);
      expect(unregisteredUser.isRegistered).to.equal(true);
      expect(unregisteredUser.votedProposalId).to.equal(0);
    });

    it("Should revert if voter if already registered", async () => {
      await voting.addVoter(this.voter1.address);
      await expectRevert(
        voting.addVoter(this.voter1.address),
        "Already registered"
      );
    });

    it("Should revert if an unregister user get a voter", async () => {
      expectRevert(
        voting.connect(this.unregisteredUser).getVoter(this.owner.address),
        "You're not a voter"
      );
    });

    it("Should revert if trying to register voter after workflow status evolved", async () => {
      await voting.startProposalsRegistering();
      await expectRevert(
        voting.addVoter(this.voter1.address),
        "Voters registration is not open yet"
      );
    });

  });

  
  // ::::::::::: START PROPOSALS REGISTRATION ::::::::::: //
  
  describe("3.START PROPOSALS REGISTRATION", () => {
    let numberOfProposals = 5; 

    beforeEach(async () => {
      await voting.addVoter(this.owner.address);
      await voting.addVoter(this.voter1.address);
      await voting.startProposalsRegistering(); 
    });

    it("Should have workflow status: Proposals Registration", async () => {
      const status = await voting.workflowStatus();
      expect(status).to.equal(WorkflowStatusProposalsRegistrationStarted);
    });

    it("Should return GENESIS proposal", async () => {
      const genesisProposal = await voting.getOneProposal(0);
      expect(genesisProposal.voteCount).to.equal(0);
      expect(genesisProposal.description).to.equal("GENESIS");
    
    });

    it("Should revert if  proposals unavailable", async () => {
      for (let index = 1; index < numberOfProposals; index++) {
        await expectRevert.unspecified(voting.getOneProposal(index));
      }
    });

    it("Should add proposals", async () => {
      for (let index = 1; index < numberOfProposals; index++) {
        // Start at 1 because of genesis proposal
        const proposalDesc = `Proposal #${index}`;
        await expect(voting.addProposal(proposalDesc))
          .to.emit(voting, "ProposalRegistered")
          .withArgs(index);

        const proposal = await voting.getOneProposal(index);
        await expect(proposal.voteCount).to.equal(0);
        await expect(proposal.description).to.equal(proposalDesc);
     
      }
      await expectRevert.unspecified(
        voting.getOneProposal(numberOfProposals + 1)
      );
    });

    it("Should revert if adding an empty proposal", async () => {
      await expectRevert(
        voting.addProposal(""),
        "Vous ne pouvez pas ne rien proposer"
      );
    });

    it("Should revert if getting proposal as unregistered voter", async () => {
      await expectRevert(
        voting.connect(this.unregisteredUser).getOneProposal(0),
        "You're not a voter"
      );
    });

    it("Should revert if add proposal as unregistered voter", async () => {
      await expectRevert(
        voting.connect(this.unregisteredUser).addProposal("Proposal #1"),
        "You're not a voter"
      );
    });

    it("Should revert if as vote still didn't start", async () => {
      await expectRevert(
        voting.setVote(0),
        "Voting session havent started yet"
      );
    });
  });
  
  
  // ::::::::::: END PROPOSALS REGISTERING ::::::::::: //
  
  describe("4.END PROPOSALS REGISTERING", () => {
    let numberOfProposals = 5;//total number of proposals

    beforeEach(async () => {
      await voting.addVoter(this.owner.address);
      await voting.addVoter(this.voter1.address);
      await voting.startProposalsRegistering();

      for (let index = 1; index < numberOfProposals; index++) {
        await voting.addProposal(`Proposal #${index}`);
      }

      await voting.endProposalsRegistering();
    });

    it("Should have worklow status: Proposals Registration Ended", async () => {
      expect(await voting.workflowStatus()).to.equal(WorkflowStatusProposalsRegistrationEnded );
    });

    it("Should return proposals within length", async () => {      
      await expectRevert.unspecified(voting.getOneProposal(numberOfProposals));
    });

    it("Should have right proposal description", async () => {
      //First proposal
      const genesisProposal = await voting.getOneProposal(0);
      expect(await genesisProposal.voteCount).to.equal(0);
      expect(await genesisProposal.description).to.equal(`GENESIS`);
      //Test proposals
      for (let index = 1; index < numberOfProposals; index++) {
        const testProposal = await voting.getOneProposal(index);
        expect(await testProposal.voteCount).to.equal(0);
        expect(await testProposal.description).to.equal(`Proposal #${index}`);        
      }
    });

    it("Should revert as adding proposals is not allowed anymore", async () => {
      await expectRevert(
        voting.addProposal("Proposal #1"),
        "Proposals are not allowed yet"
      );
    });
  });
  
  
  // ::::::::::: START VOTING SESSION ::::::::::: //  

  describe("5.START VOTING SESSION", () => {
    let numberOfProposals = 5;

    beforeEach(async () => {
      await voting.addVoter(this.owner.address);
      await voting.addVoter(this.voter1.address);
      await voting.startProposalsRegistering();
      for (let index = 1; index < numberOfProposals; index++) {
        await voting.addProposal(`Proposal #${index}`);
      }
      await voting.endProposalsRegistering();
      await voting.startVotingSession();
    });

    it("Should have worklow status: Voting Session Started", async () => {
      expect(await voting.workflowStatus()).to.equal(WorkflowStatusVotingSessionStarted);
    });

    it("Should revert if an urregisterd voters vote", async () => {
      await expectRevert(
        voting.connect(this.unregisteredUser).setVote(0),
        "You're not a voter"
      );
    });

    it("Should vote", async () => {
      const voteId = 0;

      await expect(voting.setVote(voteId))
      .to.emit(voting, "Voted")
      .withArgs(this.owner.address, voteId);

      const proposal = await voting.getOneProposal(voteId);
      expect(proposal.voteCount).to.equal(1);

      const voter = await voting.getVoter(this.owner.address);
      expect(voter.hasVoted).to.equal(true);
      expect(voter.votedProposalId).to.equal(voteId);

    });

    it("Should revert if voter already voted", async () => {
      const voteId = 0;
      await voting.setVote(voteId);
      await expectRevert(voting.setVote(voteId), "You have already voted");
    });

    it("Should revert if voter votes for a proposal that doesn't exist", async () => {
      await expectRevert(
        voting.setVote(numberOfProposals + 1),
        "Proposal not found"
      );
    });
  });

  
  // ::::::::::: END VOTING SESSION ::::::::::: //

  describe("6.END VOTING SESSION", () => {
    let numberOfProposals = 5;
    const voteId = 2;

    beforeEach(async () => {      
      await voting.addVoter(this.owner.address);
      await voting.addVoter(this.voter1.address);
      await voting.startProposalsRegistering();
      for (let index = 1; index < numberOfProposals; index++) {
        await voting.addProposal(`Proposal ${index}`);
      }
      await voting.endProposalsRegistering();
      await voting.startVotingSession();      
      await voting.setVote(voteId);
      await voting.connect(this.voter1).setVote(voteId);
      await voting.endVotingSession();
    });

    it("Should have worklow status: Voting Session Ended", async () => {
      expect(await voting.workflowStatus()).to.equal(WorkflowStatusVotingSessionEnded );
    });

    it("Should revert if voting after voting session ended", async () => {
      await expectRevert(
        voting.setVote(voteId),
        "Voting session havent started yet"
      );
    });

    it("Should have the right proposal voting count", async () => {
      for (let index = 0; index < numberOfProposals; index++) {
        const proposal = await voting.getOneProposal(index);
        expect(await proposal.voteCount).to.equal(index === voteId ? 2 : 0);
      }
    });

    it("Should winningProposalID still remain equal to 0", async () => {
      expect(await voting.winningProposalID()).to.equal(0);
    });
    
  });

  
  // ::::::::::: TALLY VOTES ::::::::::: //

  describe("7.TALLY VOTES", () => {
    let numberOfProposals = 5;
    const voteId = 3;

    beforeEach(async () => {
      await voting.addVoter(this.owner.address);
      await voting.addVoter(this.voter1.address);
      await voting.startProposalsRegistering();
      for (let index = 1; index < numberOfProposals; index++) {
        await voting.addProposal(`Proposal #${index}`);
      }
      await voting.endProposalsRegistering();
      await voting.startVotingSession();
      await voting.setVote(voteId);
      await voting.connect(this.voter1).setVote(voteId);
      await voting.endVotingSession();
      await voting.tallyVotes();
    });

    it("Should have worklow status: Tally Votes", async () => {
      expect(await voting.workflowStatus()).to.equal(WorkflowStatusVotesTallie);
    });

    it("Should have the right winner proposal id", async () => {
      expect(await voting.winningProposalID()).to.equal(voteId);
    });

    it("Should get winner proposal id as owner", async () => {
      expect(await voting.winningProposalID()).to.equal(voteId);
    });

    it("Should get winner proposal id as voter", async () => {
      expect(await voting.connect(this.voter1).winningProposalID()).to.equal(voteId);
    });

    it("Should get winner proposal id as unregistered user", async () => {
      expect(await voting.connect(this.unregisteredUser).winningProposalID()).to.equal(voteId);
    });

  });
  

});
