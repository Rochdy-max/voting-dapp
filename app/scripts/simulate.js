const hre = require("hardhat");


async function main() {
    const candidates = ["Rochdy", "Ange", "Mirke"];
    const now = Math.floor(Date.now() / 1000);
    const start = now - 3600;
    const end = now + 3600;


    const VoteContract = await hre.ethers.getContractFactory("Vote");
    const vote = await VoteContract.deploy(candidates, start, end);
    await vote.waitForDeployment();
    const addr = await vote.getAddress();
    console.log("Vote Contract deployed at:", addr);
    console.log("Vote Contract status:", await vote.electionStatus());

    console.log("Vote Contract deployment time:", await vote.deploymentTimestamp());
    console.log("Vote Contract start time:", await vote.startTime());
    console.log("Vote Contract end time:", await vote.endTime());
    console.log("Current time:", Date.now() / 1000);

    const [deployer, a1, a2, a3, a4] = await hre.ethers.getSigners();


    await (await vote.connect(a1).vote(0)).wait(); // Rochdy
    await (await vote.connect(a2).vote(1)).wait(); // Ange
    await (await vote.connect(a3).vote(1)).wait(); // Ange
    await (await vote.connect(a4).vote(2)).wait(); // Mirke


    const [names, counts] = await vote.results();
    console.log("\nSimulation Results :");
    for (let i = 0; i < names.length; i++) {
        console.log(`${names[i]}: ${counts[i].toString()} vote(s)`);
    }
}


main().catch((e) => {
    console.error(e);
    process.exit(1);
});