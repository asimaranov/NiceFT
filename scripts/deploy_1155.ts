
import { ethers } from "hardhat";

async function main() {
  
  const NiceErc1155 = await ethers.getContractFactory("NiceErc1155");
  const niceErc1155 = await NiceErc1155.deploy();

  await niceErc1155.deployed();

  console.log("NiceErc1155 deployed to:", niceErc1155.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
