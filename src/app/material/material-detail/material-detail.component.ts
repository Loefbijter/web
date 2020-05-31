import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ContentService } from '../../_modules/content/content.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ContentItem } from '../../_modules/content/content-item.model';
import { TOAST_DURATION } from '../../constants';
import { MaterialReservationsService } from '../../material-reservations/material-reservations.service';
import { Material, MaterialReservation } from '../materials.model';
import { SimpleDateService } from '../../_helpers/simple-date.service';
import { MaterialsService } from '../materials.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditMaterialDialogComponent } from '../edit-dialog/edit-material-dialog.component';
import { RemoveMaterialDialogComponent } from '../remove-dialog/remove-material-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { StatusUpdateDialogComponent } from '../../material-reservations/status-update-dialog/status-update-dialog.component';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('../materials.content.json');
// tslint:disable-next-line: no-var-requires
const content2: ContentItem = require('../../material-reservations/material-reservations.content.json');

@Component({
  selector: 'app-material-reservation',
  templateUrl: './material-detail.component.html',
  styleUrls: ['./material-detail.component.scss']
})
export class MaterialDetailComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;

  public materialID: string;
  public material: Material;
  public displayedColumns: string[] = ['status', 'user', 'amount', 'date', 'startTime', 'endTime', 'action'];
  public dataSource: MatTableDataSource<MaterialReservation>;
  public totalItemsCount: number;

  public constructor(
    public readonly simpleDateService: SimpleDateService,
    private readonly route: ActivatedRoute,
    private readonly materialReservationService: MaterialReservationsService,
    private readonly materialService: MaterialsService,
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource<MaterialReservation>();
    this.contentService.addContentItems(content);
    this.contentService.addContentItems(content2);
    this.route.paramMap.subscribe(map => {
      this.materialID = map.get('materialID');
      this.materialService.getOne(map.get('materialID')).subscribe({
        next: material => {
          this.material = material;
        },
        error: () => this.snackBar
          .open(this.contentService.get('material.detail.error.material.loading'), null, { duration: TOAST_DURATION })
      });
    });
    this.getReservations(0, 10);
  }

  public ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.onLoadMore())).subscribe();
  }

  private getReservations(page: number, limit: number): void {
    this.materialReservationService.getListForMaterial(this.materialID, { page: page + 1, limit: limit }).subscribe({
      next: reservations => {
        this.dataSource.data = reservations;
        this.totalItemsCount = this.materialReservationService.itemsTotal;
      },
      error: () => this.snackBar.open(this.contentService.get('material.reservations.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public updateStatus(materialReservation: MaterialReservation): void {
    this.dialog.open(StatusUpdateDialogComponent, { data: materialReservation, width: '500px' }).afterClosed().subscribe({
      next: (changed: boolean) => {
        if (changed) {
          this.getReservations(this.paginator.pageIndex, this.dataSource.data.length);
        }
      }
    });
  }

  public openEditDialog(): void {
    this.dialog.open(EditMaterialDialogComponent, { data: this.material, width: '500px' }).afterClosed().subscribe({
      next: (updatedMaterial: Material) => {
        if (updatedMaterial) {
          this.material = updatedMaterial;
        }
      }
    });
  }

  public openRemoveDialog(): void {
    this.dialog.open(RemoveMaterialDialogComponent, { data: this.material, width: '500px' }).afterClosed().subscribe({
      next: (remove: boolean) => {
        if (remove) {
          this.router.navigate(['/materials']).then();
        }
      }
    });
  }

  public onLoadMore(): void {
      this.getReservations(this.paginator.pageIndex, this.paginator.pageSize);
  }
}
