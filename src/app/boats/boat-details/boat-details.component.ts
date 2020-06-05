import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TOAST_DURATION } from '../../constants';
import { Damage } from '../../damage/damage.model';
import { DamageService } from '../../damage/damage.service';
import { EditDamageDialogComponent } from '../../damage/edit-damage-dialog/edit-damage-dialog.component';
import { ContentItem } from '../../_modules/content/content-item.model';
import { ContentService } from '../../_modules/content/content.service';
import { Boat } from '../boats.model';
import { BoatsService } from '../boats.service';
import { DeleteBoatDialogComponent } from './delete-boat-dialog/delete-boat-dialog.component';
import { EditBoatDialogComponent } from './edit-boat-dialog/edit-boat-dialog.component';
import { UserRole } from '../../_helpers/auth.model';
import { AuthService } from '../../_services/auth.service';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./boat-details.content.json');

@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.scss']
})
export class BoatDetailsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;

  public boat: Boat;
  public boatId: string;
  public columns: string[];
  public columnsToDisplay: string[] = ['description', 'createdAt', 'resolvedAt', 'createdByUser', 'lastUpdatedByUser', 'actions'];
  public dataSource: MatTableDataSource<Damage>;
  public totalItemsCount: number;

  public constructor(
    private readonly boatsService: BoatsService,
    private readonly damageService: DamageService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService,
    private readonly dialog: MatDialog,
    private readonly authService: AuthService
  ) { }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.dataSource = new MatTableDataSource<Damage>();
    this.boatId = this.route.snapshot.params.id;
    this.boatsService.getOne(this.boatId).subscribe({
      next: boat => {
        this.getDamages(0, 10);
        this.boat = boat;
      },
      error: () => {
        this.snackBar.open(this.contentService.get('boat-details.not-found'), null, { duration: TOAST_DURATION });
        this.router.navigate(['boats']);
      }
    });
  }

  public hasMinRoleBoard(): boolean {
    return this.authService.hasMinRole(UserRole.BOARD);
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
          this.ngOnInit();
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

  private getDamages(page: number, limit: number): void {
    this.damageService.getAll(this.boatId, page + 1, limit).subscribe({
      next: damages => {
        this.dataSource.data = damages;
        this.totalItemsCount = this.damageService.itemsTotal;
      },
      error: () => this.snackBar.open(this.contentService.get('boat-damage.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public onLoadMore(): void {
    this.getDamages(this.paginator.pageIndex, this.paginator.pageSize);
  }
}
