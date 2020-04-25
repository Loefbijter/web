import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ContentItem } from '../_modules/content/content-item.model';
import { ReservationsService } from './reservations.service';
import { Reservation } from './reservations.model';
import { ContentService } from '../_modules/content/content.service';
import { TOAST_DURATION } from '../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AcceptanceReservationsComponent } from './acceptance-reservations/acceptance-reservations.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./reservations.content.json');

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;

  public displayedColumns: string[] = ['status', 'user', 'skipper', 'boat', 'date', 'startTime', 'endTime', 'action'];
  public dataSource: MatTableDataSource<Reservation>;
  public totalItemsCount: number;

  public constructor(
    private readonly reservationsService: ReservationsService,
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Reservation>();
    this.dataSource.paginator = this.paginator;
    this.contentService.addContentItems(content);
    this.getReservations();
  }

  public ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.onLoadMore())).subscribe();
  }

  public formatDate(unixTime: number): string {
    return new Date(unixTime * 1000).toLocaleDateString();
  }

  public formatTime(unixTime: number): string {
    return new Date(unixTime * 1000).toLocaleTimeString();
  }

  private getReservations(): void {
    this.updateReservations(25);
  }

  private updateReservations(limit: number): void {
    this.reservationsService.getAll({ limit: limit }).subscribe({
      next: reservations => { this.dataSource.data = reservations; this.totalItemsCount = this.reservationsService.itemsTotal; },
      error: () => this.snackBar.open(this.contentService.get('reservations.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public reviewReservation(reservationData: Reservation): void {
    this.dialog.open(AcceptanceReservationsComponent, { data: reservationData, width: '500px' }).afterClosed().subscribe({
      next: (changed: boolean) => {
        if (changed) {
          this.updateReservations(this.dataSource.data.length);
        }
      }
    });
  }

  public onLoadMore(): void {
    if (
      this.dataSource.data.length != this.reservationsService.itemsTotal &&
      (this.paginator.pageIndex + 1 * this.paginator.pageSize) >= this.dataSource.data.length
    ) {
      this.reservationsService.getAll({ page: this.paginator.pageIndex + 1, limit: this.paginator.pageSize }).subscribe({
        next: reservations => {
          const newData: Reservation[] = this.dataSource.data.slice();
          newData.push(...reservations);
          this.dataSource.data = newData;
          this.totalItemsCount = this.reservationsService.itemsTotal;
        },
        error: () => this.snackBar.open(this.contentService.get('reservations.error.loading'), null, { duration: TOAST_DURATION })
      });
    }
  }
}
