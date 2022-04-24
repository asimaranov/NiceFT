import { task, types } from "hardhat/config";

task("mint1155", "Stake tokens")
    .addParam("contractAddr", "Address of the deployed ERC1155 token contract", "0xC343feD11513D2DB76Fd788BB310757C51b4e054")
    .addParam("userAddr", "Address of user to mint", "0x2836eC28C32E232280F984d3980BA4e05d6BF68f")
    .addParam("tokenId", "Id of token", 0, types.int)
    .addParam("amount", "Amount of token to mint", 100, types.int)
    .addParam("metadataUrl", "Metadata addr", "ipfs://QmbXPbcha5PQ8svupeC7XAYRuT7SAPNZwG7YjmJ7rdkdHR/{id}.json")

    .setAction(async (taskArgs, hre) => {

        const erc1155Contract = await hre.ethers.getContractAt("NiceErc1155", taskArgs['contractAddr']);
        const mintTransaction = await erc1155Contract.mint(taskArgs['userAddr'], taskArgs['tokenId'], taskArgs['amount'], taskArgs['metadataUrl']);

        const rc = await mintTransaction.wait();

        const transferEvent = rc.events!.find(e => e.event == 'TransferSingle');

        const [operator, from, to, id, amount] = transferEvent!.args!;

        console.log(
            `Successfully minted ${amount} tokens ${id} to ${to}\n`
        );
    });