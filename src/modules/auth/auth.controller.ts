import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequest, AuthResponse, ForgotPasswordModel, LoginRequest, RegisterResponse, ResetPasswordModel } from './auth-request.dto';
import { AuthService } from './auth.service';
import { ApiDocs } from '../../core/decorators/api.decorator';
import { GenericResponse } from '../../core/types/responses';
import { AuthToolsService } from '../../core/tools/auth-helper';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authTools: AuthToolsService,
  ) { }
  @Post('login')
  @ApiOkResponse({ type: AuthResponse })
  @ApiDocs({
    summary: 'Login',
    operationId: 'login',
    badRequestMessage: 'Unable to login',
  })
  async login(@Body() requestModel: LoginRequest): Promise<AuthResponse> {
    return await this.authService.login(requestModel);
  }

  @Post('register')
  @ApiOkResponse({ type: RegisterResponse })
  @ApiDocs({
    summary: 'Register',
    operationId: 'register',
    badRequestMessage: 'Unable to register',
  })
  async register(@Body() requestModel: AuthRequest): Promise<RegisterResponse> {
    return await this.authService.register(requestModel);
  }

  @Patch('refresh/:token')
  @ApiOkResponse({ type: AuthResponse })
  @ApiDocs({
    summary: 'Refresh token',
    operationId: 'refreshToken',
    badRequestMessage: 'Unable to refresh token',
  })
  async refresh(@Param('token') token: string): Promise<AuthResponse> {
    return await this.authService.refresh(token);
  }

  @Post('logout')
  @ApiOkResponse({ type: GenericResponse })
  @ApiDocs({
    summary: 'Logout',
    operationId: 'logout',
    badRequestMessage: 'Unable to logout',
  })
  async logout(): Promise<GenericResponse> {
    const payload = this.authTools.checkUserPayload();
    return await this.authService.logout(payload);
  }

  @Patch('activate/:token')
  @ApiOkResponse({ type: GenericResponse })
  @ApiDocs({
    summary: 'Activate account',
    operationId: 'activeAccount',
    badRequestMessage: 'Unable to activate account',
  })
  async activate(@Param('token') token: string): Promise<GenericResponse> {
    return await this.authService.activateAccount(token);
  }

  @Post('forgot')
  @ApiOkResponse({ type: GenericResponse })
  @ApiDocs({
    summary: 'Forgot password',
    operationId: 'forgot',
    badRequestMessage: 'Unable to forgot password',
  })
  async forgot(
    @Body() forgotModel: ForgotPasswordModel,
  ): Promise<GenericResponse> {
    return await this.authService.forgotPassword(forgotModel);
  }

  @Post('reset')
  @ApiOkResponse({ type: GenericResponse })
  @ApiDocs({
    summary: 'Reset password',
    operationId: 'reset',
    badRequestMessage: 'Unable to reset password',
  })
  async reset(
    @Body() resetModel: ResetPasswordModel,
  ): Promise<GenericResponse> {
    return await this.authService.resetPassword(resetModel);
  }
}