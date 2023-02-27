import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../types/payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.REFRESH_TOKEN_SECRET,
            passReqToCallBack: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const refreshToken = req
            .get('Authorization')
            .replace('Bearer', ' ')
            .trim();
        return {
            ...payload,
            refreshToken,
        };
    }
}