import { Component, Inject } from '@angular/core';
import { Boat } from '../../boats.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoatsService } from '../../boats.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../../_modules/content/content.service';
import { TOAST_DURATION } from '../../../constants';

@Component({
  selector: 'app-delete-boat-dialog',
  templateUrl: './delete-boat-dialog.component.html',
  styles: ['.actions { display: flex; justify-content: flex-end; }']
})
export class DeleteBoatDialogComponent {

  public constructor(
    @Inject(MAT_DIALOG_DATA) public boat: Boat,
    public readonly dialogRef: MatDialogRef<DeleteBoatDialogComponent>,
    private readonly boatsService: BoatsService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService
  ) { }

  public onConfirm(): void {
    this.boatsService.remove(this.boat.id).subscribe({
      next: () => {
        this.snackBar.open(this.contentService.get('delete-boat.success'), null, { duration: TOAST_DURATION });
        // Signal back that the boat was successfully deleted
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open(this.contentService.get('delete-boat.error'), null, { duration: TOAST_DURATION });
        this.dialogRef.close();
      }
    });
  }
}
