import { CanActivate, Router, RouterStateSnapshot, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Observable } from 'rxjs';
import { Tokens } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  public constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const currentUser: Tokens = this.authService.currentUserValue;
    if (currentUser) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    return this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
      .then(() => false);
  }
}
