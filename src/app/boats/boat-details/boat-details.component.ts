import { Component, OnInit } from '@angular/core';
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

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./boat-details.content.json');

@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.scss']
})
export class BoatDetailsComponent implements OnInit {

  public boat: Boat;
  public columns: string[];

  public constructor(
    private readonly boatsService: BoatsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService,
    private readonly dialog: MatDialog
  ) { }

  public boatData = () => Object.entries(this.boat).map((v: [string, string]) => ({ key: v[0], value: v[1] }));

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.route.paramMap.subscribe(map => {
      this.boatsService.getOne(map.get('id')).subscribe({
        next: boat => {
          this.boat = boat;
          this.columns = ['key', 'value'];
        },
        error: () => {
          this.snackBar.open(this.contentService.get('boat-details.not-found'), null, { duration: TOAST_DURATION });
          this.router.navigate(['boats']);
        }
      });
    });
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

  public onDeleteClick(): void {
    this.dialog.open(DeleteBoatDialogComponent, { data: this.boat }).afterClosed().subscribe({
      next: (deleted: boolean) => {
        if (deleted) {
          this.router.navigate(['boats']);
        }
      }
    });
  }
}
