import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Global()
@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
    ],
    exports: [
        AuthService,
        PassportModule,
        JwtModule,
    ],
})
export class AuthModule { }
