import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const timeoutMs = Number(request.headers['timeout']) || 5000; // Timeout en millisecondes, par défaut 5 secondes

        return next.handle().pipe(
            timeout(timeoutMs),
            catchError((error) => {
                if (error instanceof TimeoutError) {
                    return throwError(new RequestTimeoutException('La requête a expiré'));
                }
                return throwError(error);
            }),
        );
    }
}


