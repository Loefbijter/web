import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ContentItem } from '../_modules/content/content-item.model';
import { ReservationsService } from './reservations.service';
import { Reservation, Order } from './reservations.model';
import { ContentService } from '../_modules/content/content.service';
import { TOAST_DURATION } from '../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AcceptanceReservationsComponent } from './acceptance-reservations/acceptance-reservations.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SimpleDateService } from '../_helpers/simple-date.service';
import { DeleteBoatReservationDialogComponent } from "./delete-boat-reservation-dialog/delete-boat-reservation-dialog.component";

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./reservations.content.json');

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;

  public displayedColumns: string[] = ['status', 'user', 'skipper', 'boat', 'reason', 'date', 'action'];
  public dbColumns: string[] = ['accepted', 'userId', 'skipper', 'boatId', 'reason', 'startTimestamp']; //missing: user.name & boat.name instead of IdReferences
  public currentOrderBy: number;
  public currentSortOrder: Order;
  public dataSource: MatTableDataSource<Reservation>;
  public totalItemsCount: number;

  public constructor(
    private readonly reservationsService: ReservationsService,
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    public readonly simpleDateService: SimpleDateService,
  ) {
    this.contentService.addContentItems(content);
    this.currentOrderBy = 5;
    this.currentSortOrder=Order.DESC;
  }

  public ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource<Reservation>();
    this.getReservations(this.paginator.pageIndex, this.paginator.pageSize);
  }

  private getReservations(page: number, limit: number): void {
    this.reservationsService.getAll({ limit: limit, page: page + 1, orderBy: this.dbColumns[this.currentOrderBy], order: this.currentSortOrder}).subscribe({
      next: reservations => {
        this.dataSource.data = reservations;
        this.totalItemsCount = this.reservationsService.itemsTotal;
      },
      error: () => this.snackBar.open(this.contentService.get('reservations.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public reviewReservation(reservationData: Reservation): void {
    this.dialog.open(AcceptanceReservationsComponent, { data: reservationData, width: '500px' }).afterClosed().subscribe({
      next: (changed: boolean) => {
        if (changed) {
          this.ngAfterViewInit();
        }
      }
    });
  }

  public onLoadMore(): void {
    this.getReservations(this.paginator.pageIndex, this.paginator.pageSize);
  }

  public showDeleteBoatReservationDialog(reservation: Reservation): void {
    this.dialog.open(DeleteBoatReservationDialogComponent, { width: '500px', data: reservation }).afterClosed().subscribe({
      next: (deleted) => {
        if (deleted) {
          // Reload the data
          this.ngAfterViewInit();
        }
      }
    });
  }

  public orderColumn(columnNumber: number): void{
    if(columnNumber === this.currentOrderBy) {
      if(this.currentSortOrder === Order.DESC) {
        this.currentSortOrder = Order.ASC;
      } 
      else {
        this.currentSortOrder = Order.DESC;}
    }
    else {
      this.currentOrderBy = columnNumber;
    }
    this.onLoadMore();
  }
}
