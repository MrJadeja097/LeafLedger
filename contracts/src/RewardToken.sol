// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    mapping(address => bool) public authorizedMinters;

    constructor() ERC20("Eco Reward Token", "ECO") Ownable(msg.sender) {}

    function setMinter(address minter, bool status) external onlyOwner {
        authorizedMinters[minter] = status;
    }

    function mint(address to, uint256 amount) external {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized");
        _mint(to, amount);
    }
}
