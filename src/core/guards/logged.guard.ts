import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthToolsService } from '../tools/auth-helper';

@Injectable()
export class LoggedGuard implements CanActivate {
    constructor(
        private authToolService: AuthToolsService,
    ) {

    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const payload = this.authToolService.getCurrentPayload(false);
        if (payload) return true;
        else return false;
    }
}