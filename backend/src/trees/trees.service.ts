import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tree, TreeStatus } from './tree.entity';
import { PlantTreeDto, ConfirmPlantingDto } from './tree.dto';
import { UsersService } from '../users/users.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class TreesService {
  constructor(
    @InjectRepository(Tree)
    private readonly treeRepo: Repository<Tree>,
    private readonly usersService: UsersService,
    private readonly blockchainService: BlockchainService,
  ) {}

  async plantTree(userId: string, dto: PlantTreeDto): Promise<Tree> {
    const tree = this.treeRepo.create({
      userId,
      latitude: dto.latitude,
      longitude: dto.longitude,
      locationName: dto.locationName,
      ngoPartner: dto.ngoPartner,
      status: TreeStatus.PENDING,
    });
    const saved = await this.treeRepo.save(tree);

    // Trigger on-chain minting via backend wallet (admin call)
    const user = await this.usersService.findById(userId);
    const metadataUri = `https://eco-game.io/metadata/tree/${saved.id}`;
    const coordinates = `${dto.latitude},${dto.longitude}`;
    try {
      const { tokenId, txHash } = await this.blockchainService.registerPlanting(
        user.walletAddress || '0x0000000000000000000000000000000000000000',
        metadataUri,
        coordinates,
      );
      await this.treeRepo.update(saved.id, {
        tokenId: tokenId.toString(),
        transactionHash: txHash,
        metadataUri,
        status: TreeStatus.CONFIRMED,
      });
      await this.usersService.incrementTreeCount(userId);
    } catch (err) {
      console.error('On-chain planting failed, keeping as PENDING', err.message);
    }

    return this.treeRepo.findOne({ where: { id: saved.id } });
  }

  async getMyTrees(userId: string): Promise<Tree[]> {
    return this.treeRepo.find({ where: { userId }, order: { plantedAt: 'DESC' } });
  }

  async getAllTrees(): Promise<Tree[]> {
    return this.treeRepo.find({ order: { plantedAt: 'DESC' }, relations: ['user'] });
  }

  async getTreeById(id: string): Promise<Tree> {
    const tree = await this.treeRepo.findOne({ where: { id }, relations: ['user'] });
    if (!tree) throw new NotFoundException('Tree not found');
    return tree;
  }

  async getStats(): Promise<{ totalTrees: number; confirmedTrees: number; pendingTrees: number; players: number; ecoEarned: number; countries: number }> {
    const [totalTrees, confirmedTrees, pendingTrees, players, ecoEarned, countriesResult] = await Promise.all([
      this.treeRepo.count(),
      this.treeRepo.count({ where: { status: TreeStatus.CONFIRMED } }),
      this.treeRepo.count({ where: { status: TreeStatus.PENDING } }),
      this.usersService.countUsers(),
      this.usersService.getTotalEcoEarned(),
      this.treeRepo
        .createQueryBuilder('tree')
        .select('COUNT(DISTINCT tree.locationName)', 'count')
        .getRawOne(),
    ]);
    
    const countries = parseInt(countriesResult?.count || '0', 10);

    return { totalTrees, confirmedTrees, pendingTrees, players, ecoEarned, countries };
  }
}
