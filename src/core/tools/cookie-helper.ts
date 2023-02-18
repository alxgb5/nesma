import { CookieOptions, Request, Response } from 'express';
import { refreshTokenLsKey } from '../types/enums';

export class CookieHelpers {
  static setCookie(
    res: Response,
    key: string,
    value: string,
    options?: CookieOptions,
  ) {
    if (!res) return;
    res.cookie(key, value, options);
  }
  static getCookie(req: Request, key: string) {
    if (!req || !req.headers.cookie) return null;
    const cookie = req.headers.cookie.replace(refreshTokenLsKey + '=', '');
    return cookie;
  }
  static deleteCookie(res: Response, key: string) {
    if (!res) return;
    res.clearCookie(key);
  }
}
