import { CanActivate, Router, RouterStateSnapshot, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Observable } from 'rxjs';
import { UserRole } from './auth.model';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  public constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const role: number = route.data.role as UserRole;
    const hasMinRole: boolean = this.authService.hasMinRole(role);
    if (hasMinRole) {
      // logged in so return true
      return true;
    }

    return this.router.navigate(['/home']).then(() => false);
  }
}
