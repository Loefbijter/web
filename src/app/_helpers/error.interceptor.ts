import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  public constructor(private readonly authService: AuthService) { }

  public intercept(req: HttpRequest<object>, next: HttpHandler): Observable<HttpEvent<object>> {
    if (req.headers.has('x-refreshing')) {
      return next.handle(req);
    }
    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        // 401 means the bearerToken is invalid, attempting to refresh using refreshToken
        return this.authService.refresh().pipe(
          switchMap(() => {
            // rerun original request with new token
            return next.handle(req);
          }),
          catchError((refreshRequest: HttpErrorResponse) => {
            if (refreshRequest.status === 401) {
              // refreshing was denied, log the user out
              this.authService.logout();
              location.reload();
              return EMPTY;
            }
          }));
      }
      return throwError(err.statusText);
    }));
  }
}
