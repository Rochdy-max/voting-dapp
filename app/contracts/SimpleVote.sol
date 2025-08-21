// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleVote {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    constructor(string[] memory candidateNames) {
        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({name: candidateNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 candidateId) external {
        require(!hasVoted[msg.sender], "Already voted !");
        require(candidateId < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount += 1;
    }

    function getResults() external view returns (string[] memory names, uint256[] memory counts) {
        uint256 len = candidates.length;
        names = new string[](len);
        counts = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            names[i] = candidates[i].name;
            counts[i] = candidates[i].voteCount;
        }
    }
}
