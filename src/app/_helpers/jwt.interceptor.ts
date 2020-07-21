import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { Observable } from 'rxjs';
import { Tokens } from './auth.model';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  public constructor(private readonly authService: AuthService) { }

  public intercept(req: HttpRequest<object>, next: HttpHandler): Observable<HttpEvent<object>> {
    // append authorization header with jwt token if available
    let newReq: HttpRequest<object>;
    const currentUser: Tokens = this.authService.currentUserValue;
    if (currentUser && currentUser.bearerToken) {
      newReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.bearerToken}`
        }
      });
    }
    return next.handle(newReq || req);
  }
}
