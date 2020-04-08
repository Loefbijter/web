import { Component } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  public get loggedIn(): boolean {
    return this.authService.currentUserValue && typeof this.authService.currentUserValue === 'object';
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
