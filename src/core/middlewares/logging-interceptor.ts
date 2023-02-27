import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger('LoggingInterceptor');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                this.logger.log(`${method} ${url} - ${Date.now() - now}ms`);
            }),
            catchError((error) => {
                this.logger.error(`Erreur dans la requête ${method} ${url} : ${error}`);
                throw error;
            }),
        );
    }
}