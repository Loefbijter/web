import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../users.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { TOAST_DURATION } from '../../constants';
import { AuthService } from '../../_services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { ContentItem } from 'src/app/_modules/content/content-item.model';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./user-details.content.json');

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  public user: User;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {
    this.contentService.addContentItems(content);
  }

  public ngOnInit(): void {
    const id: string = this.route.snapshot.paramMap.get('id');
    this.usersService.getOne(id).subscribe({
      next: user => {
        this.user = user;
      },
      error: () => {
        this.snackBar.open(this.contentService.get('user-details.not-found'), null, { duration: TOAST_DURATION });
        this.router.navigate(['users']);
      }
    });
  }

  public onResetPasswordClick(): void {
    this.authService.resetPassword(this.user.email).subscribe({
      next: () => this.snackBar.open(this.contentService.get('user-details.reset-password.success'), null, { duration: TOAST_DURATION }),
      error: () => this.snackBar.open(this.contentService.get('user-details.reset-password.error'), null, { duration: TOAST_DURATION })
    });
  }

  public onEditClick(): void {
    this.dialog.open(EditUserDialogComponent, { data: this.user, width: '500px' }).afterClosed().subscribe({
      next: (updated) => {
        if (updated) {
          this.ngOnInit();
        }
      }
    });
  }

  public onDeleteClick(): void {
    this.dialog.open(DeleteUserDialogComponent, { data: this.user, width: '500px' }).afterClosed().subscribe({
      next: (deleted) => {
        if (deleted) {
          this.router.navigate(['users']);
        }
      }
    });
  }
}
