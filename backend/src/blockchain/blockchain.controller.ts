import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly configService: ConfigService,
  ) {}

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getBalance(@Query('wallet') wallet: string) {
    const tokenAddress = this.configService.get<string>('REWARD_TOKEN_CONTRACT_ADDRESS', '0x0');
    const balance = await this.blockchainService.getTokenBalance(wallet, tokenAddress);
    return { wallet, balance, token: 'ECO' };
  }
}
