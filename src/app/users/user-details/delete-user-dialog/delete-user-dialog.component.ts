import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../users.model';
import { UsersService } from '../../users.service';
import { ContentService } from 'src/app/_modules/content/content.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_DURATION } from 'src/app/constants';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styles: ['.actions { display: flex; justify-content: flex-end; } .actions>* { margin: 0 5px; }']
})
export class DeleteUserDialogComponent {

  public constructor(
    @Inject(MAT_DIALOG_DATA) public readonly user: User,
    public readonly dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    private readonly usersService: UsersService,
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar,
  ) { }

  public onConfirm(): void {
    this.dialogRef.disableClose = true;
    this.usersService.remove(this.user.id).subscribe({
      next: () => {
        this.dialogRef.disableClose = false;
        this.snackBar.open(this.contentService.get('delete-user.success'), null, { duration: TOAST_DURATION });
        // Signal back that the deletion was completed
        this.dialogRef.close(true);
      },
      error: () => {
        this.dialogRef.disableClose = false;
        this.snackBar.open(this.contentService.get('delete-user.error'), null, { duration: TOAST_DURATION });
      }
    });
  }
}
