import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CreateActivityDialogComponent } from './create-activity-dialog/create-activity-dialog.component';
import { DeleteActivityDialogComponent } from './delete-activity-dialog/delete-activity-dialog.component';
import { EditActivityDialogComponent } from './edit-activity-dialog/edit-activity-dialog.component';
import { TOAST_DURATION } from '../constants';
import { ContentItem } from '../_modules/content/content-item.model';
import { ContentService } from '../_modules/content/content.service';
import { ActivitiesService } from './activities.service';
import { Activity } from './activity.model';
import { QuestionManagementComponent } from './question-management/question-management.component';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./activities.content.json');

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})

export class ActivitiesComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;

  public columnsToDisplay: string[] = ['title', 'organiser', 'start', 'end', 'entries', 'questions', 'edit', 'delete'];
  public dataSource: MatTableDataSource<Activity>;
  public totalItemsCount: number;
  private readonly snackBar: MatSnackBar;

  public constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly contentService: ContentService,
    private readonly dialog: MatDialog,
  ) {
    this.contentService.addContentItems(content);
  }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Activity>();
    this.onLoadMore();
  }

  private getActivities(page: number, limit: number): void {
    this.activitiesService.getAll(limit, page + 1).subscribe({
      next: activities => {
        this.dataSource.data = activities;
        this.totalItemsCount = this.activitiesService.itemsTotal;
      },
      error: () => this.snackBar.open(this.contentService.get('activities.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public onLoadMore(): void {
    this.getActivities(this.paginator.pageIndex, this.paginator.pageSize);
  }

  public showCreateActivityDialog(): void {
    this.dialog.open(CreateActivityDialogComponent, { width: '1000px', height: '80vh' }).afterClosed().subscribe({
      next: (newActivity) => {
        if (newActivity) {
          // Reload the data
          this.ngOnInit();
        }
      }
    });
  }

  public showEditActivityQuestionsDialog(activity: Activity): void {
    this.dialog.open(QuestionManagementComponent, { width: '1000px', data: activity });
  }

  public showEditActivityDialog(activity: Activity): void {
    this.dialog.open(EditActivityDialogComponent, { width: '1000px', height: '80vh', data: activity }).afterClosed().subscribe({
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
