import {
  Controller, Post, Body, HttpCode, HttpStatus,
  Injectable, Module, UnauthorizedException,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IsString, IsNotEmpty } from 'class-validator';
import { LdapService } from '../ldap/ldap.service';

// ── DTO ──────────────────────────────────────────────────────────────
export class LoginDto {
  @IsString() @IsNotEmpty() username: string;
  @IsString() @IsNotEmpty() password: string;
}

// ── Service ──────────────────────────────────────────────────────────
@Injectable()
export class AuthService {
  constructor(
    private readonly ldap: LdapService,
    private readonly jwt:  JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.ldap.authenticate(dto.username, dto.password);

    const payload = {
      sub:         user.username,
      username:    user.username,
      displayName: user.displayName,
      email:       user.email,
      department:  user.department,
      groups:      user.groups,
    };

    const access_token = this.jwt.sign(payload);

    return {
      access_token,
      user: {
        username:    user.username,
        displayName: user.displayName,
        email:       user.email,
        department:  user.department,
        dn:          user.dn,
        groups:      user.groups,
      },
    };
  }
}

// ── Controller ───────────────────────────────────────────────────────
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }
}

// ── Module ───────────────────────────────────────────────────────────
@Module({
  imports: [
    JwtModule.register({
      secret:      process.env.JWT_SECRET || 'change-me',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
    }),
  ],
  controllers: [AuthController],
  providers:   [AuthService, LdapService],
})
export class AuthModule {}
