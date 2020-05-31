import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialReservation, MaterialReservationStatus } from '../material/materials.model';
import { SimpleDateService } from '../_helpers/simple-date.service';
import { MaterialReservationsService } from './material-reservations.service';
import { ContentService } from '../_modules/content/content.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ContentItem } from '../_modules/content/content-item.model';
import { TOAST_DURATION } from '../constants';
import { StatusUpdateDialogComponent } from './status-update-dialog/status-update-dialog.component';
import { MatPaginator } from '@angular/material/paginator';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./material-reservations.content.json');

@Component({
  selector: 'app-material-reservation-overview',
  templateUrl: './material-reservations.component.html',
  styleUrls: ['./material-reservations.component.scss']
})
export class MaterialReservationsComponent implements OnInit {

  public status: number = -1;
  // tslint:disable-next-line:no-any
  public statusOptions: any = MaterialReservationStatus;

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;

  public displayedColumns: string[] = ['material', 'status', 'user', 'amount', 'date', 'startTime', 'endTime', 'action'];
  public dataSource: MatTableDataSource<MaterialReservation>;
  public totalItemsCount: number;

  public constructor(
    public readonly simpleDateService: SimpleDateService,
    private readonly materialReservationService: MaterialReservationsService,
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    ) { }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource<MaterialReservation>();
    this.contentService.addContentItems(content);
    this.getReservations(0, 10);
  }

  public getReservations(page: number, limit: number): void {
    if (this.status == -1) {
      this.materialReservationService
        .getList({ page: page + 1, limit: limit}).subscribe({
        next: reservations => {
          this.dataSource.data = reservations;
          this.totalItemsCount = this.materialReservationService.itemsTotal;
        },
        error: () => this.snackBar.open(this.contentService.get('material.reservations.error.loading'), null, { duration: TOAST_DURATION})
      });
    }
    else {
      this.materialReservationService
        .getListForStatus(this.status, { page: page + 1, limit: limit}).subscribe({
        next: reservations => {
          this.dataSource.data = reservations;
          this.totalItemsCount = this.materialReservationService.itemsTotal;
        },
        error: () => this.snackBar.open(this.contentService.get('material.reservations.error.loading'), null, { duration: TOAST_DURATION})
      });
    }
  }

  public updateStatus(materialReservation: MaterialReservation): void {
    this.dialog.open(StatusUpdateDialogComponent, { data: materialReservation, width: '500px' }).afterClosed().subscribe({
      next: (changed: boolean) => {
        if (changed) {
          this.getReservations(0, this.paginator.pageSize);
        }
      }
    });
  }

  public onLoadMore(): void {
    this.getReservations(this.paginator.pageIndex, this.paginator.pageSize);
  }

  public statusChange(): void {
    this.paginator.pageIndex = 0;
    this.getReservations(this.paginator.pageIndex, this.paginator.pageSize);
  }
}
