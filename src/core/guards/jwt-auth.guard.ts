import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { List } from 'linqts';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { Environment } from '../environments';
import { ExpiredTokenException } from '../handlers/expiration-token';
import { AuthToolsService, DecodeTokenResponse } from '../tools/auth-helper';
import { CookieHelpers } from '../tools/cookie-helper';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        protected jwtService: JwtService,
        protected prisma: PrismaService,
    ) {
        super('jwt');
    }

    async canActivate(context: ExecutionContext) {
        return await this.canAccessForRole(context);
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }

    async canAccessForRole(context: ExecutionContext, roles?: string[]): Promise<boolean> {
        const request = AuthToolsService.getRequestFromContext(context);
        const decodeResponse = this.getAccessTokenFromHeadersOrCookie(request);
        if (decodeResponse?.payload) {
            if (roles?.length) {
                return (
                    decodeResponse.payload.roles &&
                    new List(roles)
                        .Intersect(new List(decodeResponse.payload.roles))
                        .Any()
                );
            } else return true;
        }
        if (decodeResponse.error === 'TokenExpiredError') {
            let refreshTokenOk = false;
            if (request) {
                const refreshTokenFromCookie = CookieHelpers.getCookie(
                    request,
                    Environment.TOKEN_KEY,
                );
                if (refreshTokenFromCookie) {
                    const findUserResponse = await this.prisma.user.findFirst({
                        where: { refreshToken: refreshTokenFromCookie },
                    });
                    refreshTokenOk = findUserResponse && findUserResponse.enabled;
                }
            }
            if (!refreshTokenOk) throw new ExpiredTokenException();
            else return true;
        }
        return false;
    }

    private getAccessTokenFromHeadersOrCookie(request: any): DecodeTokenResponse {
        if (!request) return { error: 'NoRequestData' };
        let decodeResponse = AuthToolsService.getJwtPayloadFromRequest(
            this.jwtService,
            request,
            false,
        );
        if (decodeResponse.error !== 'NoTokenError') {
            return decodeResponse;
        }
        const accessTokenCookie = CookieHelpers.getCookie(
            request,
            Environment.TOKEN_KEY,
        );
        if (!accessTokenCookie) return { error: 'NoTokenError' };
        decodeResponse = AuthToolsService.decodeToken(
            this.jwtService,
            accessTokenCookie,
            false,
        );
        return decodeResponse;
    }
}
