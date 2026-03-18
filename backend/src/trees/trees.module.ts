import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tree } from './tree.entity';
import { TreesService } from './trees.service';
import { TreesController } from './trees.controller';
import { UsersModule } from '../users/users.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tree]), UsersModule, BlockchainModule],
  providers: [TreesService],
  controllers: [TreesController],
})
export class TreesModule {}
