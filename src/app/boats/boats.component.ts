import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Boat } from './boats.model';
import { BoatsService } from './boats.service';
import { ContentItem } from '../_modules/content/content-item.model';
import { ContentService } from '../_modules/content/content.service';
import { CreateBoatDialogComponent } from './create-boat-dialog/create-boat-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_DURATION } from '../constants';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./boats.content.json');

@Component({
  selector: 'app-boats',
  templateUrl: './boats.component.html',
  styleUrls: ['./boats.component.scss']
})
export class BoatsComponent implements OnInit {

  public boats: Boat[];
  public readonly pageSize: number = 8;

  public constructor(
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly boatsService: BoatsService
  ) { }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.getBoats();
  }

  public get allItemsLoaded(): boolean {
    return this.boatsService.itemsTotal && this.boatsService.itemsTotal == this.boats.length;
  }

  private getBoats(): void {
    this.boatsService.getAll(1, this.pageSize).subscribe({
      next: boats => this.boats = boats,
      error: () => this.snackBar.open(this.contentService.get('boats.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public onLoadMore(): void {
    const nextPage: number = Math.ceil(this.boats.length / this.pageSize) + 1;
    this.boatsService.getAll(nextPage, this.pageSize).subscribe({
      next: boats => this.boats.push(...boats),
      error: () => this.snackBar.open(this.contentService.get('boats.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public showCreateBoatForm(): void {
    this.dialog.open(CreateBoatDialogComponent, { width: '500px' }).afterClosed().subscribe({
      next: (boat: Boat) => {
        if (boat) {
          this.boats.push(boat);
        }
      }
    });
  }
}
