import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public mobile: boolean = false;

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

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
