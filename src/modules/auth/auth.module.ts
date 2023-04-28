import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Environment } from '../../core/environments';
import { AccessTokenStrategy } from '../../core/guards/at.strategy';
import { RolesGuard } from '../../core/guards/roles.guard';
import { RefreshTokenStrategy } from '../../core/guards/rt.strategy';
import { AuthToolsService } from '../../core/tools/auth-helper';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from '../mail/mail.module';
@Global()
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      signOptions: { expiresIn: Environment.TOKEN_EXPIRATION },
      privateKey: process.env.REFRESH_TOKEN_SECRET,
      publicKey: process.env.ACCESS_TOKEN_SECRET,
    }),
    MailModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RolesGuard,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthToolsService,
  ],
  exports: [
    AuthService,
    PassportModule,
    JwtModule,
    AuthToolsService,
    RolesGuard
  ],
})
export class AuthModule { }
