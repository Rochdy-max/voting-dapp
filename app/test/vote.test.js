const hre = require("hardhat");
const ethers = hre.ethers;

const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");


describe("Vote", function () {
    async function deployFixture() {
        const [owner, voter1, voter2] = await ethers.getSigners();
        const now = await time.latest();
        const start = now;
        const end = now + 3600;
        const candidates = ["Alice", "Bob"];

        console.log(now)


        const SimpleVote = await ethers.getContractFactory("Vote");
        const vote = await SimpleVote.deploy(candidates, start, end);
        await vote.waitForDeployment();
        return { vote, owner, voter1, voter2, start, end };
    }


    it("permet 1 vote et bloque le double vote", async () => {
        const { vote, voter1 } = await deployFixture();
        await vote.connect(voter1).vote(0);
        await expect(vote.connect(voter1).vote(0)).to.be.revertedWith("already voted");
    });


    it("compte correctement", async () => {
        const { vote, voter1, voter2 } = await deployFixture();
        await vote.connect(voter1).vote(0);
        await vote.connect(voter2).vote(1);
        const [, counts] = await vote.results();
        expect(counts[0]).to.equal(1n);
        expect(counts[1]).to.equal(1n);
    });


    it("rejette hors période", async () => {
        const { vote, voter1, end } = await deployFixture();
        await time.increaseTo(end + 1);
        await expect(vote.connect(voter1).vote(0)).to.be.revertedWith("not active");
    });
});