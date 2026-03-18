// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {RewardToken} from "./RewardToken.sol";
import {TreeNFT} from "./TreeNFT.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract PlantingLogic is Ownable {
    RewardToken public rewardToken;
    TreeNFT public treeNft;
    
    uint256 public rewardAmount;
    
    event TreePlanted(address indexed user, uint256 indexed tokenId, string coordinates);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(address _rewardToken, address _treeNft, uint256 _rewardAmount) Ownable(msg.sender) {
        rewardToken = RewardToken(_rewardToken);
        treeNft = TreeNFT(_treeNft);
        rewardAmount = _rewardAmount;
    }

    function setRewardAmount(uint256 _amount) external onlyOwner {
        rewardAmount = _amount;
    }

    // Called by backend once verifying real-world planting
    function registerPlanting(address user, string calldata metadataURI, string calldata coordinates) external onlyOwner {
        // Mint NFT
        uint256 tokenId = treeNft.mintTree(user, metadataURI);
        emit TreePlanted(user, tokenId, coordinates);
        
        // Give Reward
        if (rewardAmount > 0) {
            rewardToken.mint(user, rewardAmount);
            emit RewardClaimed(user, rewardAmount);
        }
    }
}
