import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: User): { accessToken: string; user: Partial<User> } {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        walletAddress: user.walletAddress,
        tokenBalance: user.tokenBalance,
        treesPlanted: user.treesPlanted,
      },
    };
  }
}
