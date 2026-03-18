import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsEthereumAddress } from 'class-validator';

class UpdateWalletDto {
  @IsEthereumAddress()
  walletAddress: string;
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMe(@Request() req) {
    return req.user;
  }

  @Put('me/wallet')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateWallet(@Request() req, @Body() dto: UpdateWalletDto) {
    return this.usersService.updateWallet(req.user.id, dto.walletAddress);
  }
}
