import { Component } from '@angular/core';
import { UserRole } from '../_helpers/auth.model';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  // tslint:disable-next-line:typedef
  public get userRole() { return UserRole; }

  public constructor(
    private readonly authService: AuthService
  ) {
  }

  public hasMinRole(role: UserRole): boolean {
    return this.authService.hasMinRole(role);
  }

}
