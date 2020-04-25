import { Component, OnInit, Inject } from '@angular/core';
import { Reservation } from '../reservations.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReservationsService } from '../reservations.service';
import { ContentService } from '../../_modules/content/content.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_DURATION } from '../../constants';
import { ContentItem } from '../../_modules/content/content-item.model';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('../reservations.content.json');

@Component({
  selector: 'app-acceptance-reservations',
  templateUrl: './acceptance-reservations.component.html',
  styleUrls: ['./acceptance-reservations.component.scss']
})
export class AcceptanceReservationsComponent implements OnInit {

  public constructor(
    @Inject(MAT_DIALOG_DATA) public reservation: Reservation,
    public readonly dialogRef: MatDialogRef<AcceptanceReservationsComponent>,
    private readonly reservationsService: ReservationsService,
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar
  ) { }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
  }

  public formatDate(unixTime: number): string {
    return new Date(unixTime * 1000).toLocaleDateString();
  }

  public formatTime(unixTime: number): string {
    return new Date(unixTime * 1000).toLocaleTimeString();
  }

  public acceptanceOfReservation(status: boolean): void {
    this.reservationsService.setAcceptanceOfReservation(this.reservation.id, { status: status }).subscribe({
      next: () => {
        this.snackBar.open(this.contentService.get('update-reservation-acceptance.success'), null, { duration: TOAST_DURATION });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open(this.contentService.get('update-reservation-acceptance.error'), null, { duration: TOAST_DURATION });
        this.dialogRef.close();
      }
    });

  }
}
