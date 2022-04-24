//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract NiceErc1155 is ERC1155 {
    address private owner;

    string public name = "Nice Erc 1155";
    string public symbol = "NiFT1155";

    modifier onlyOwner() {
        require(msg.sender == owner, "You're not the owner");
        _;
    }

    constructor() ERC1155("https://ipfs.io/ipfs/QmbXPbcha5PQ8svupeC7XAYRuT7SAPNZwG7YjmJ7rdkdHR/{id}.json") {
        owner = msg.sender;
    }

    function mint(address user, uint256 tokenId, uint256 amount, string memory metadataUrl) public onlyOwner {
        _mint(user, tokenId, amount, "");
        _setURI(metadataUrl);
    }
}