// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721URIStorage, ERC721} from "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract TreeNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping(address => bool) public authorizedMinters;

    constructor() ERC721("Virtual Tree", "VTREE") Ownable(msg.sender) {}

    function setMinter(address minter, bool status) external onlyOwner {
        authorizedMinters[minter] = status;
    }

    function mintTree(address to, string calldata metadataURI) external returns (uint256) {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        return tokenId;
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }
}
