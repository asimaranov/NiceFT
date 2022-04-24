# Advanced Sample Hardhat Project

This project contains simple implemenation of opensea-compatible ERC721, ERC1155 tokens. 

The project comes with a token contracst, test for those contracts, scripts that deploys those contracts and mint task implementations. 

## Contract addresses
Rinkeby:
- Erc721: `0x8b398468ef17d83607d6C42553D8101120e134A7`
- Erc1155: `0xC343feD11513D2DB76Fd788BB310757C51b4e054`

## Verification
Rinkeby:
- Erc721: https://rinkeby.etherscan.io/address/0x8b398468ef17d83607d6C42553D8101120e134A7#code
- Erc1155: https://rinkeby.etherscan.io/address/0xC343feD11513D2DB76Fd788BB310757C51b4e054#code

## Opensea tokens gallery
- Erc721: https://testnets.opensea.io/collection/niceft721-v2
- Erc1155: https://testnets.opensea.io/collection/nice-erc-1155-v3

## How to deploy

- Erc721 contract
```shell
npx hardhat run scripts/deploy_721.ts --network rinkeby
```

- Erc1155 contract
```shell
npx hardhat run scripts/deploy_1155.ts --network rinkeby
```

## How to mint

- Erc721 contract
```shell
npx hardhat mint721 --contract-addr 0x8b398468ef17d83607d6C42553D8101120e134A7 --user-addr 0x2836eC28C32E232280F984d3980BA4e05d6BF68f --token-url ipfs://QmWkyzTp1DwfeL7BDuUsKjGVAsudDs8zzsKCzaR9qE4pwp --network rinkeby
```

- Erc1155 contract
```shell
npx hardhat mint1155 --contract-addr 0x8b398468ef17d83607d6C42553D8101120e134A7 --user-addr 0x2836eC28C32E232280F984d3980BA4e05d6BF68f --token-id 0 --amount 100 --metadata-url "ipfs://QmbXPbcha5PQ8svupeC7XAYRuT7SAPNZwG7YjmJ7rdkdHR/{id}.json" --network rinkeby
```
