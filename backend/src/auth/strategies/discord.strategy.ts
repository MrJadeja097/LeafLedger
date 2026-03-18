import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('DISCORD_CLIENT_ID'),
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET'),
      callbackURL: configService.get<string>('DISCORD_CALLBACK_URL'),
      scope: ['identify', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const { id, username, email, avatar } = profile;
    const avatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` : undefined;
    const user = await this.usersService.findOrCreate({
      discordId: id,
      email,
      displayName: username,
      avatarUrl,
    });
    done(null, user);
  }
}
