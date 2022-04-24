
import { ethers } from "hardhat";

async function main() {
  
  const NiceErc721 = await ethers.getContractFactory("NiceErc721");
  const niceErc721 = await NiceErc721.deploy();

  await niceErc721.deployed();

  console.log("NiceErc721 deployed to:", niceErc721.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
