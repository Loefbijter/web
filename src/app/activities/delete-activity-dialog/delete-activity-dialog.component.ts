import { Component, Inject } from '@angular/core';
import { Activity } from '../activity.model';
import { ActivitiesService } from '../activities.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { TOAST_DURATION } from '../../constants';

@Component({
  selector: 'app-delete-activity-dialog',
  templateUrl: './delete-activity-dialog.component.html',
  styleUrls: ['./delete-activity-dialog.component.scss']
})

export class DeleteActivityDialogComponent {

  public constructor(
    @Inject(MAT_DIALOG_DATA) public activity: Activity,
    public readonly dialogRef: MatDialogRef<DeleteActivityDialogComponent>,
    private readonly activitiesService: ActivitiesService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService
  ) { }

  public onConfirm(): void {
    this.activitiesService.remove(this.activity.id).subscribe({
      next: () => {
        this.snackBar.open(this.contentService.get('delete-activity.success'), null, { duration: TOAST_DURATION });
        // Signal back that the activity was deleted successfully
        this.dialogRef.close(true);
      },
      error: err => {
        if (err === 'Unprocessable Entity') {
          this.snackBar.open(this.contentService.get('delete-activity.error.in-use'), null, { duration: TOAST_DURATION });
          this.dialogRef.close();
        }
      }
    });
  }

}
