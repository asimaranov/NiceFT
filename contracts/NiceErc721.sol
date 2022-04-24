//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NiceErc721 is ERC721URIStorage{

    uint256 public tokenCount;
    address private owner;

    modifier onlyOwner(){
        require(msg.sender == owner, "You're not the owner");
        _;
    }

    constructor() ERC721("NiceFT721", "NiFT"){
        tokenCount = 0;
        owner = msg.sender;
    }

    function mint(address user, string memory tokenUrl) public onlyOwner returns (uint256 tokenId){
        _mint(user, tokenCount);
        _setTokenURI(tokenCount, tokenUrl);
        tokenId = tokenCount;
        tokenCount++;
    }
}