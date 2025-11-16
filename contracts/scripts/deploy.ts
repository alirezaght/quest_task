import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  
  const contract = await viem.deployContract("QuestPoints");
  console.log("QuestPoints contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});