import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

const PLANTING_LOGIC_ABI = [
  'function registerPlanting(address user, string calldata metadataURI, string calldata coordinates) external',
  'event TreePlanted(address indexed user, uint256 indexed tokenId, string coordinates)',
  'event RewardClaimed(address indexed user, uint256 amount)',
];

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private plantingLogic: ethers.Contract;

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('INITIA_RPC_URL');
    const privateKey = this.configService.get<string>('BACKEND_WALLET_PRIVATE_KEY');
    const contractAddress = this.configService.get<string>('PLANTING_LOGIC_CONTRACT_ADDRESS');

    if (rpcUrl && privateKey && contractAddress) {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      this.plantingLogic = new ethers.Contract(contractAddress, PLANTING_LOGIC_ABI, this.wallet);
      this.logger.log(`BlockchainService connected to ${rpcUrl}`);
    } else {
      this.logger.warn('Blockchain env vars not set — on-chain calls will be skipped');
    }
  }

  async registerPlanting(
    userAddress: string,
    metadataUri: string,
    coordinates: string,
  ): Promise<{ tokenId: bigint; txHash: string }> {
    if (!this.plantingLogic) {
      throw new Error('Blockchain not configured');
    }

    this.logger.log(`Registering planting for ${userAddress} at ${coordinates}`);
    const tx = await this.plantingLogic.registerPlanting(userAddress, metadataUri, coordinates);
    const receipt = await tx.wait();

    // Parse the TreePlanted event to get tokenId
    const iface = new ethers.Interface(PLANTING_LOGIC_ABI);
    let tokenId = BigInt(0);
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed?.name === 'TreePlanted') {
          tokenId = parsed.args.tokenId;
        }
      } catch {
        // skip unrelated logs
      }
    }

    return { tokenId, txHash: receipt.hash };
  }

  async getTokenBalance(walletAddress: string, tokenAddress: string): Promise<string> {
    if (!this.provider) return '0';
    const erc20Abi = ['function balanceOf(address) view returns (uint256)'];
    const token = new ethers.Contract(tokenAddress, erc20Abi, this.provider);
    const balance = await token.balanceOf(walletAddress);
    return balance.toString();
  }
}
