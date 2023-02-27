import {
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Optional,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../../modules/users/user.dto';
import { JwtPayload } from '../types/payload';

export type JwtDecodeError =
  | 'TokenExpiredError'
  | 'JsonWebTokenError'
  | 'NoTokenError'
  | 'NoRequestData';
export interface DecodeTokenResponse {
  payload?: JwtPayload;
  error?: JwtDecodeError;
}
@Injectable({ scope: Scope.REQUEST })
export class AuthToolsService {
  public static getRequestFromContext(context: ExecutionContext): Request {
    if (!context) return null;
    const httpContext = context.switchToHttp();
    if (!httpContext) return null;
    const request = httpContext.getRequest();
    if (!request) return null;
    return request;
  }
  public static getResponseFromContext(context: ExecutionContext): Response {
    if (!context) return null;
    const httpContext = context.switchToHttp();
    if (!httpContext) return null;
    const response = httpContext.getResponse();
    if (!response) return null;
    return response;
  }

  public static getJwtPayloadFromRequest(
    jwtService: JwtService,
    request: any,
    ignoreExpiration: boolean,
  ): DecodeTokenResponse {
    if (!request || !request.headers || !request.headers.authorization)
      return { error: 'NoTokenError' };
    return AuthToolsService.getJwtPayloadFromAuthHeader(
      jwtService,
      request.headers.authorization,
      ignoreExpiration,
    );
  }

  public static getJwtTokenFromAuthHeader(authorizationHeader: string): string {
    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '');
      return token;
    }
    return null;
  }
  public static getJwtPayloadFromAuthHeader(
    jwtService: JwtService,
    authorizationHeader: string,
    ignoreExpiration: boolean,
  ): DecodeTokenResponse {
    const jwtToken = this.getJwtTokenFromAuthHeader(authorizationHeader);
    if (jwtToken)
      return AuthToolsService.decodeToken(
        jwtService,
        jwtToken,
        ignoreExpiration,
      );
    return { error: 'NoTokenError' };
  }

  public static decodeToken(
    jwtService: JwtService,
    encodedToken: string,
    ignoreExpiration: boolean,
  ): DecodeTokenResponse {
    let decoded: JwtPayload = null;
    let error: JwtDecodeError;
    try {
      decoded = jwtService.decode(encodedToken) as JwtPayload;
    } catch (err) {
      if (err?.name) error = err.name;
    }
    return { payload: decoded, error: error };
  }

  constructor(
    @Optional() @Inject(REQUEST) private readonly request: any,
    public readonly jwtService: JwtService,
  ) { }
  public getCurrentPayload(ignoreExpiration: boolean): JwtPayload {
    if (this.request)
      return AuthToolsService.getJwtPayloadFromRequest(
        this.jwtService,
        this.request,
        ignoreExpiration,
      ).payload;
    return null;
  }
}

export async function AuthCustomRules(user: UserDto) {
  //Write here custom auth rules
  const ok = !!user;
  if (!ok) {
    throw new ForbiddenException('Forbidden resource');
  }
}
