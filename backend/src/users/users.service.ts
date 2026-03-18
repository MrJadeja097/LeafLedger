import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id }, relations: ['trees'] });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findOrCreate(data: Partial<User>): Promise<User> {
    const existing = data.email
      ? await this.findByEmail(data.email)
      : null;
    if (existing) {
      return existing;
    }
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async updateWallet(userId: string, walletAddress: string): Promise<User> {
    await this.usersRepo.update(userId, { walletAddress });
    return this.findById(userId);
  }

  async updateTokenBalance(userId: string, balance: string): Promise<void> {
    await this.usersRepo.update(userId, { tokenBalance: balance });
  }

  async incrementTreeCount(userId: string): Promise<void> {
    await this.usersRepo.increment({ id: userId }, 'treesPlanted', 1);
  }

  async countUsers(): Promise<number> {
    return this.usersRepo.count();
  }

  async getTotalEcoEarned(): Promise<number> {
    const result = await this.usersRepo
      .createQueryBuilder('user')
      .select('SUM(user.tokenBalance)', 'sum')
      .getRawOne();
    
    return parseInt(result.sum || '0', 10);
  }
}
