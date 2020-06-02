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
import { SimpleDateService } from '../_helpers/simple-date.service';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./reservations.content.json');

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;

  public displayedColumns: string[] = ['status', 'user', 'skipper', 'boat', 'reason', 'date', 'action'];
  public dataSource: MatTableDataSource<Reservation>;
  public totalItemsCount: number;

  public constructor(
    private readonly reservationsService: ReservationsService,
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    public readonly simpleDateService: SimpleDateService,
  ) { }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.dataSource = new MatTableDataSource<Reservation>();
    this.getReservations(0, 10);
  }

  public ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.onLoadMore())).subscribe();
  }

  private getReservations(page: number, limit: number): void {
    this.reservationsService.getAll({ limit: limit, page: page + 1 }).subscribe({
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
          this.ngOnInit();
        }
      }
    });
  }

  public onLoadMore(): void {
    this.getReservations(this.paginator.pageIndex, this.paginator.pageSize);
  }
}
