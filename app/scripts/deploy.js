const hre = require("hardhat");


async function main() {
    const candidates = ["Rochdy", "Ange", "Mirke"];
    const now = Math.floor(Date.now() / 1000);
    const start = now; // start now
    const end = now + 3600; // end in 1h


    const VoteContract = await hre.ethers.getContractFactory("Vote");
    const vote = await VoteContract.deploy(candidates, start, end);
    await vote.waitForDeployment();


    const addr = await vote.getAddress();
    console.log("Vote Contract deployed at:", addr);
}


main().catch((e) => {
    console.error(e);
    process.exit(1);
});