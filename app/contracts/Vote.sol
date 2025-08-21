// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Vote {
    struct Candidate {
        string name;
        uint256 voteCount;
    }


    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;


    uint256 public startTime;
    uint256 public endTime;
    address public owner;
    uint256 public deploymentTimestamp;


    event Voted(address indexed voter, uint256 indexed candidateId);
    event CandidateAdded(uint256 indexed candidateId, string name);


    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }


    modifier onlyDuringElection() {
        require(
            block.timestamp >= startTime && block.timestamp <= endTime,
            "not active"
        );
        _;
    }


    constructor(
        string[] memory candidateNames,
        uint256 _startTime,
        uint256 _endTime
    ) {
        require(_startTime < _endTime, "invalid times");
        owner = msg.sender;
        startTime = _startTime;
        endTime = _endTime;
        deploymentTimestamp = block.timestamp;

        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({name: candidateNames[i], voteCount: 0}));
            emit CandidateAdded(i, candidateNames[i]);
        }
    }


    function vote(uint256 candidateId) external onlyDuringElection {
        require(!hasVoted[msg.sender], "already voted");
        require(candidateId < candidates.length, "invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount += 1;

        emit Voted(msg.sender, candidateId);
    }


    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }


    function results() external view returns (string[] memory names, uint256[] memory counts) {
        uint256 len = candidates.length;
        names = new string[](len);
        counts = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            names[i] = candidates[i].name;
            counts[i] = candidates[i].voteCount;
        }
    }


    function electionStatus() external view returns (string memory) {
        if (block.timestamp < startTime) return "not_started";
        if (block.timestamp > endTime) return "ended";
        return "running";
    }
}