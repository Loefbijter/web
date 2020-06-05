import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { Router } from '@angular/router';
import { UserRole } from './_helpers/auth.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public mobile: boolean = false;

  // tslint:disable-next-line:typedef
  public get userRole() { return UserRole; }

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
  }

  public ngOnInit(): void {
    this.checkWindowResize();
    window.addEventListener('resize', this.checkWindowResize.bind(this));
  }

  public ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkWindowResize.bind(this));
  }

  private checkWindowResize(): void {
    this.mobile = window.innerWidth < 768;
  }

  public get loggedIn(): boolean {
    return this.authService.currentUserValue && typeof this.authService.currentUserValue === 'object';
  }

  public hasMinRole(role: UserRole): boolean {
    return this.authService.hasMinRole(role);
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
