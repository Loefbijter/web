import { Component, Inject } from '@angular/core';
import { Activity, Registration, RegistrationActivity } from '../../activity.model';
import { ActivitiesService } from '../../activities.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../../_modules/content/content.service';
import { TOAST_DURATION } from '../../../constants';

@Component({
  selector: 'app-delete-entry-dialog',
  templateUrl: './delete-entry-dialog.component.html',
  styleUrls: ['./delete-entry-dialog.component.scss']
})

export class DeleteEntryDialogComponent {

  public constructor(
    @Inject(MAT_DIALOG_DATA) public param: RegistrationActivity,
    public readonly dialogRef: MatDialogRef<DeleteEntryDialogComponent>,
    private readonly activitiesService: ActivitiesService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService
  ) { }

  public onConfirm(): void {
    this.activitiesService.deleteRegistration(this.param.registration.id).subscribe({
      next: () => {
        this.snackBar.open(this.contentService.get('delete-entry.success'), null, { duration: TOAST_DURATION });
        // Signal back that the activity was deleted successfully
        this.dialogRef.close(true);
      },
      error: err => {
        this.snackBar.open(this.contentService.get('delete-entry.error'), null, { duration: TOAST_DURATION });
        this.dialogRef.close();
      }
    });
  }
}
