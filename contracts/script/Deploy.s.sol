// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {RewardToken} from "../src/RewardToken.sol";
import {TreeNFT} from "../src/TreeNFT.sol";
import {PlantingLogic} from "../src/PlantingLogic.sol";

/**
 * @title Deploy
 * @notice Full-environment deploy script for LeafLedger contracts.
 *
 * Usage:
 *   forge script script/Deploy.s.sol:Deploy \
 *     --rpc-url <RPC_URL> \
 *     --private-key <PRIVATE_KEY> \
 *     --broadcast \
 *     --verify   # optional: verify on explorer if supported
 *
 * Environment variables (alternative to flags):
 *   DEPLOYER_PRIVATE_KEY  — deployer private key
 *   REWARD_AMOUNT         — ECO tokens rewarded per tree (18 decimals, default: 100 ECO)
 */
contract Deploy is Script {
    // Default reward: 100 ECO (18 decimals)
    uint256 constant DEFAULT_REWARD_AMOUNT = 100 * 1e18;

    function run() external {
        // ── Load deployer key ───────────────────────────────────────────────
        uint256 deployerPrivateKey = 0x8e6a0d4a35afc2b88865e7c0981c64d1b985b0432f7bae8f4a6cdfd34abdb7c8;

        address deployer = vm.addr(deployerPrivateKey);

        // Optional: override the reward amount via env var
        uint256 rewardAmount = 1e18;

        console.log("===========================================");
        console.log(" LeafLedger -- Full Environment Deployment");
        console.log("===========================================");
        console.log("Deployer  :", deployer);
        console.log("Reward amt:", rewardAmount, "(wei)");
        console.log("-------------------------------------------");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy RewardToken (ECO ERC-20)
        RewardToken rewardToken = new RewardToken();
        console.log("RewardToken (ECO) :", address(rewardToken));

        // 2. Deploy TreeNFT (VTREE ERC-721)
        TreeNFT treeNft = new TreeNFT();
        console.log("TreeNFT (VTREE)   :", address(treeNft));

        // 3. Deploy PlantingLogic (orchestrator)
        PlantingLogic plantingLogic = new PlantingLogic(
            address(rewardToken),
            address(treeNft),
            rewardAmount
        );
        console.log("PlantingLogic     :", address(plantingLogic));

        // 4. Grant PlantingLogic minter permissions on both tokens
        rewardToken.setMinter(address(plantingLogic), true);
        treeNft.setMinter(address(plantingLogic), true);
        console.log("Minter roles granted to PlantingLogic on both tokens");

        vm.stopBroadcast();

        console.log("-------------------------------------------");
        console.log("Deployment complete!");
        console.log("");
        console.log("Copy these into backend/.env:");
        console.log("  PLANTING_LOGIC_CONTRACT_ADDRESS=", address(plantingLogic));
        console.log("  REWARD_TOKEN_ADDRESS=", address(rewardToken));
        console.log("  TREE_NFT_ADDRESS=", address(treeNft));
        console.log("===========================================");
    }
}
