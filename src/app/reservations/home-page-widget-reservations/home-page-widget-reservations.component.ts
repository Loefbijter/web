import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../reservations.service';
import { Reservation } from '../reservations.model';
import { TOAST_DURATION } from '../../constants';
import { ContentService } from '../../_modules/content/content.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentItem } from '../../_modules/content/content-item.model';
import { AcceptanceReservationsComponent } from '../acceptance-reservations/acceptance-reservations.component';
import { MatDialog } from '@angular/material/dialog';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('../reservations.content.json');

@Component({
  selector: 'app-home-page-widget-reservations',
  templateUrl: './home-page-widget-reservations.component.html',
  styleUrls: ['./home-page-widget-reservations.component.scss']
})
export class HomePageWidgetReservationsComponent implements OnInit {

  public reservations: Reservation[] = [];
  public totalOpenReservations: number;

  public constructor(
    private readonly reservationsService: ReservationsService,
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.getReservations();
  }

  private getReservations(): void {
    this.reservationsService.getAllOpen({ limit: 9 }).subscribe({
      next: reservations => { this.reservations = reservations; this.totalOpenReservations = this.reservationsService.openItemsTotal; },
      error: () => this.snackBar.open(this.contentService.get('reservations.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public reviewReservation(reservationData: Reservation): void {
    this.dialog.open(AcceptanceReservationsComponent, { data: reservationData, width: '500px' }).afterClosed().subscribe({
      next: (deleted: boolean) => {
        if (deleted) {
          this.getReservations();
        }
      }
    });
  }

  public formatDate(starTimeStamp: number, endTimeStamp: number): string {
    const date: string = new Date(starTimeStamp * 1000).toLocaleDateString();
    const startTime: string = new Date(starTimeStamp * 1000).toLocaleTimeString();
    const endTime: string = new Date(endTimeStamp * 1000).toLocaleTimeString();
    return (
      date + ' ' + startTime.substring(0, startTime.lastIndexOf(':'))
      + ' ' + this.contentService.get('reservations.review.until.text') + ' ' +
      endTime.substring(0, endTime.lastIndexOf(':'))
    );
  }
}
