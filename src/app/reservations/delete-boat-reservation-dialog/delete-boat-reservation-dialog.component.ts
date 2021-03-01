import { Component, Inject } from '@angular/core';
import { Reservation} from "../reservations.model";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { TOAST_DURATION } from '../../constants';
import { ReservationsService } from "../reservations.service";

@Component({
  selector: 'app-delete-activity-dialog',
  templateUrl: './delete-boat-reservation-dialog.component.html',
  styleUrls: ['./delete-boat-reservation-dialog.component.scss']
})

export class DeleteBoatReservationDialogComponent {

  public constructor(
    @Inject(MAT_DIALOG_DATA) public reservation: Reservation,
    public readonly dialogRef: MatDialogRef<DeleteBoatReservationDialogComponent>,
    private readonly boatReservationService: ReservationsService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService
  ) { }

  public onConfirm(): void {
    this.boatReservationService.remove(this.reservation.id).subscribe({
      next: () => {
        this.snackBar.open(this.contentService.get('delete-reservation.success'), null, { duration: TOAST_DURATION });
        // Signal back that the activity was deleted successfully
        this.dialogRef.close(true);
      },
      error: err => {
        if (err === 'Unprocessable Entity') {
          this.snackBar.open(this.contentService.get('delete-reservation.error'), null, { duration: TOAST_DURATION });
          this.dialogRef.close();
        }
      }
    });
  }
}
