import { Component, OnInit } from '@angular/core';
import { MaterialReservation, MaterialReservationStatus } from '../../material/materials.model';
import { ContentItem } from '../../_modules/content/content-item.model';
import { ContentService } from '../../_modules/content/content.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MaterialReservationsService } from '../material-reservations.service';
import { TOAST_DURATION } from '../../constants';
import { SimpleDateService } from '../../_helpers/simple-date.service';
import { StatusUpdateDialogComponent } from '../status-update-dialog/status-update-dialog.component';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('../material-reservations.content.json');

@Component({
  selector: 'app-material-reservation-home-widget',
  templateUrl: './material-reservation-home-widget.component.html',
  styleUrls: ['./material-reservation-home-widget.component.scss']
})
export class MaterialReservationHomeWidgetComponent implements OnInit {

  public materialReservations: MaterialReservation[] = [];
  public totalReservations: number;

  public status: MaterialReservationStatus = MaterialReservationStatus.REQUESTED;
  // tslint:disable-next-line:no-any
  public statusOptions: any = MaterialReservationStatus;

  public constructor(
    public readonly simpleDateService: SimpleDateService,
    private readonly materialReservationsService: MaterialReservationsService,
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
  }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.getReservations();
  }

  public getReservations(): void {
    if (this.status != -1) {
      this.materialReservationsService.getListForStatus(this.status, { limit: 10 }).subscribe({
        next: reservations => {
          this.materialReservations = reservations;
          this.totalReservations = this.materialReservationsService.itemsTotal;
        },
        error: () => this.snackBar.open(this.contentService.get('material.reservations.error.loading'), null, { duration: TOAST_DURATION })
      });
    }
    else {
      this.materialReservationsService.getList({ limit: 10 }).subscribe({
        next: reservations => {
          this.materialReservations = reservations;
          this.totalReservations = this.materialReservationsService.itemsTotal;
        },
        error: () => this.snackBar.open(this.contentService.get('material.reservations.error.loading'), null, { duration: TOAST_DURATION })
      });
    }
  }

  public changeReservationStatus(materialReservation: MaterialReservation): void {
    this.dialog.open(StatusUpdateDialogComponent, { data: materialReservation, width: '500px' }).afterClosed().subscribe({
      next: (changed: boolean) => {
        if (changed) {
          this.getReservations();
        }
      }
    });
  }
}
