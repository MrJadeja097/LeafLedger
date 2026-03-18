import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // ── Google OAuth ───────────────────────────────────────────────────
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Request() req, @Res() res: Response) {
    const { accessToken } = this.authService.login(req.user);
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');
    return res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
  }

  // ── Discord OAuth ──────────────────────────────────────────────────
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  discordLogin() {
    // Guard redirects to Discord
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  discordCallback(@Request() req, @Res() res: Response) {
    const { accessToken } = this.authService.login(req.user);
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');
    return res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
  }
}
