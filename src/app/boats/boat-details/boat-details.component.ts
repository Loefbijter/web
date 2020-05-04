import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BoatsService } from '../boats.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Boat } from '../boats.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from 'src/app/_modules/content/content.service';
import { ContentItem } from 'src/app/_modules/content/content-item.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteBoatDialogComponent } from './delete-boat-dialog/delete-boat-dialog.component';
import { EditBoatDialogComponent } from './edit-boat-dialog/edit-boat-dialog.component';
import { TOAST_DURATION } from '../../constants';
import { Damage } from '../../damage/damage.model';
import { DamageService } from '../../damage/damage.service';
import { EditDamageDialogComponent } from '../../damage/edit-damage-dialog/edit-damage-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./boat-details.content.json');

@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.scss']
})
export class BoatDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;

  public boat: Boat;
  public boatId: string;
  public columns: string[];
  public columnsToDisplay: string[] = ['description', 'createdAt', 'resolvedAt', 'actions'];
  public dataSource: MatTableDataSource<Damage>;
  public totalItemsCount: number;

  public constructor(
    private readonly boatsService: BoatsService,
    private readonly damageService: DamageService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService,
    private readonly dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Damage>();
    this.dataSource.paginator = this.paginator;
    this.contentService.addContentItems(content);
    this.route.paramMap.subscribe(map => {
      this.boatId = map.get('id');
      this.boatsService.getOne(map.get('id')).subscribe({
        next: boat => {
          this.boat = boat;
        },
        error: () => {
          this.snackBar.open(this.contentService.get('boat-details.not-found'), null, { duration: TOAST_DURATION });
          this.router.navigate(['boats']);
        }
      });
    });
    this.getDamages();
  }

  public ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.onLoadMore())).subscribe();
  }

  public onEditClick(): void {
    this.dialog.open(EditBoatDialogComponent, { data: this.boat, width: '500px' }).afterClosed().subscribe({
      next: (editedBoat: Boat) => {
        if (editedBoat) {
          // Reload boat data, to get the changes.
          this.boat = editedBoat;
        }
      }
    });
  }

  public onDamageEditClick(damageData: Damage): void {
    this.dialog.open(EditDamageDialogComponent, { data: damageData, width: '500px' }).afterClosed().subscribe({
        next: (changed: boolean) => {
          if (changed) {
            this.updateDamages(this.dataSource.data.length);
          }
        }
    });
  }

  public onDeleteClick(): void {
    this.dialog.open(DeleteBoatDialogComponent, { data: this.boat }).afterClosed().subscribe({
      next: (deleted: boolean) => {
        if (deleted) {
          this.router.navigate(['boats']);
        }
      }
    });
  }

  private getDamages(): void {
    this.updateDamages(10);
  }

  private updateDamages(limit: number): void {
    this.damageService.getAll(this.boatId, undefined, limit).subscribe({
      next: damages => { this.dataSource.data = damages; this.totalItemsCount = this.damageService.itemsTotal; },
      error: () => this.snackBar.open(this.contentService.get('boat-damage.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public onLoadMore(): void {
    if (
      this.dataSource.data.length != this.damageService.itemsTotal &&
      (this.paginator.pageIndex + 1 * this.paginator.pageSize) >= this.dataSource.data.length
    ) {
      this.damageService.getAll(this.boat.id, this.paginator.pageIndex + 1, this.paginator.pageSize).subscribe({
        next: damages => {
          const newData: Damage[] = this.dataSource.data.slice();
          newData.push(...damages);
          this.dataSource.data = newData;
          this.totalItemsCount = this.damageService.itemsTotal;
        },
        error: () => this.snackBar.open(this.contentService.get('boat-damage.error.loading'), null, { duration: TOAST_DURATION })
      });
    }
  }
}
