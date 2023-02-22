import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequest } from './auth-request.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('login')
    async login(@Body() requestModel: AuthRequest) {
        return this.authService.login(requestModel);
    }

    @Post('register')
    async register(@Body() requestModel: AuthRequest) {
        return this.authService.register(requestModel);
    }

    @Post('refresh')
    async refresh() {

    }

    @Post('logout')
    async logout() {

    }
}