import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ContentItem } from '../_modules/content/content-item.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Activity } from './activity.model';
import { ActivitiesService } from './activities.service';
import { ContentService } from '../_modules/content/content.service';
import { TOAST_DURATION } from '../constants';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CreateActivityDialogComponent } from '../activities/create-activity-dialog/create-activity-dialog.component';
import { EditActivityDialogComponent } from '../activities/edit-activity-dialog/edit-activity-dialog.component';
import { DeleteActivityDialogComponent } from '../activities/delete-activity-dialog/delete-activity-dialog.component';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./activities.content.json');

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})

export class ActivitiesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;

  public columnsToDisplay: string[] = ['title', 'start', 'end', 'questions', 'edit', 'delete'];
  public dataSource: MatTableDataSource<Activity>;
  public totalItemsCount: number;
  private readonly snackBar: MatSnackBar;

  public constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly contentService: ContentService,
    private readonly dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Activity>();
    this.dataSource.paginator = this.paginator;
    this.contentService.addContentItems(content);
    this.getActivities();
  }

  public ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.onLoadMore())).subscribe();
  }

  private getActivities(): void {
    this.updateActivities(25);
  }

  private updateActivities(limit: number): void {
    this.activitiesService.getAll(limit).subscribe({
      next: activities => {
        this.dataSource.data = activities;
        this.totalItemsCount = this.activitiesService.itemsTotal;
      },
      error: () => this.snackBar.open(this.contentService.get('activities.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public onLoadMore(): void {
    if (
      this.dataSource.data.length != this.totalItemsCount &&
      (this.paginator.pageIndex + 1 * this.paginator.pageSize) >= this.dataSource.data.length
    ) {
      this.activitiesService.getAll().subscribe({
        next: activities => {
          const newData: Activity[] = this.dataSource.data.slice();
          newData.push(...activities);
          this.dataSource.data = newData;
          this.totalItemsCount = this.activitiesService.itemsTotal;
        },
        error: () => this.snackBar.open(this.contentService.get('activities.error.loading'), null, { duration: TOAST_DURATION })
      });
    }
  }

  public showCreateActivityDialog(): void {
    this.dialog.open(CreateActivityDialogComponent, { width: '1000px' }).afterClosed().subscribe({
      next: (newActivity) => {
        if (newActivity) {
          // Reload the data
          this.ngOnInit();
        }
      }
    });
  }

  public showEditActivityQuestionsDialog(activity: Activity): void {
    // todo
  }

  public showEditActivityDialog(activity: Activity): void {
    this.dialog.open(EditActivityDialogComponent, { width: '1000px', data: activity }).afterClosed().subscribe({
      next: (editedActivity) => {
        if (editedActivity) {
          // Reload the data
          this.ngOnInit();
        }
      }
    });
  }

  public showDeleteActivityDialog(activity: Activity): void {
    this.dialog.open(DeleteActivityDialogComponent, { width: '1000px', data: activity }).afterClosed().subscribe({
      next: (deleted) => {
        if (deleted) {
          // Reload the data
          this.ngOnInit();
        }
      }
    });
  }
}
