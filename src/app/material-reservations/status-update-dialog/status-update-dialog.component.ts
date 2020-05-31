import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialReservation, MaterialReservationStatus } from '../../material/materials.model';
import { TOAST_DURATION } from '../../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { MaterialReservationsService } from '../material-reservations.service';
import { SimpleDateService } from '../../_helpers/simple-date.service';

@Component({
  selector: 'app-status-update-dialog',
  templateUrl: './status-update-dialog.component.html',
  styleUrls: ['./status-update-dialog.component.scss']
})
export class StatusUpdateDialogComponent {

  public status: MaterialReservationStatus = null;
  // tslint:disable-next-line:no-any
  public statusOptions: any = MaterialReservationStatus;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public materialReservation: MaterialReservation,
    public readonly dialogRef: MatDialogRef<StatusUpdateDialogComponent>,
    private readonly materialService: MaterialReservationsService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService,
    public readonly simpleDateService: SimpleDateService,
  ) {
    this.status = materialReservation.status;
  }

  public onConfirm(): void {
    this.materialService.updateStatus(this.materialReservation.id, this.status).subscribe({
      next: () => {
        this.snackBar.open(this.contentService.get('material.reservations.update-status.success'), null, { duration: TOAST_DURATION });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open(this.contentService.get('material.reservations.update-status.error'), null, { duration: TOAST_DURATION });
        this.dialogRef.close();
      }
    });
  }
}
