import { task } from "hardhat/config";

task("mint721", "Stake tokens")
    .addParam("contractAddr", "Address of the deployed ERC721 token contract", "0x8b398468ef17d83607d6C42553D8101120e134A7")
    .addParam("userAddr", "Address of user to mint", "0x2836eC28C32E232280F984d3980BA4e05d6BF68f")
    .addParam("tokenUrl", "Address of metadata", "ipfs://QmWkyzTp1DwfeL7BDuUsKjGVAsudDs8zzsKCzaR9qE4pwp")

    .setAction(async (taskArgs, hre) => {

        const erc721Contract = await hre.ethers.getContractAt("NiceErc721", taskArgs['contractAddr']);
        const mintTransaction = await erc721Contract.mint(taskArgs['userAddr'], taskArgs['tokenUrl']);

        const rc = await mintTransaction.wait();

        const transferEvent = rc.events!.find(e => e.event == 'Transfer');

        const [from, to, tokenId] = transferEvent!.args!;

        console.log(
            `Successfully minted token ${tokenId} to ${to}\n`
        );
    });