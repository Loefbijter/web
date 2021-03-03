import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivitiesService } from '../activities.service';
import { Activity, Registration, Question, Answer } from '../activity.model';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { TOAST_DURATION } from '../../constants';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { ContentItem } from '../../_modules/content/content-item.model';
import { DeleteEntryDialogComponent } from './delete-entry-dialog/delete-entry-dialog.component';
import { QuestionTypes } from '../question-management/question.model';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('../activities.content.json');

@Component({
  selector: 'app-entries-dialog',
  templateUrl: './activity-entries.component.html',
  styleUrls: ['./activity-entries.component.scss']
})
export class ActivityEntriesComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;

  public activityId: string;
  public activity: Activity;
  public questions: Question[] = [];

  public columnsToDisplay: string[] = ['username', 'email'];
  public dataSource: MatTableDataSource<Registration>;
  public totalItemsCount: number;

  public constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService,
    private readonly dialog: MatDialog,
  ) {
    this.contentService.addContentItems(content);
  }

  public ngOnInit(): void {
    this.activityId = this.route.snapshot.params.id;
    this.activitiesService.getOne(this.activityId).subscribe({
      next: activity => {
        this.activity = activity;
      }
    });
    this.activitiesService.getQuestions(this.activityId).subscribe({
      next: questions => {
        console.log(questions);
        this.questions.push(...questions);
        for (const q of this.questions) {
          this.columnsToDisplay.push(q.text);
        }
      },
      complete: () => {
        if (!this.columnsToDisplay.includes('delete')) {
          this.columnsToDisplay.push('delete');
        }
      }
    });
    console.log(this.columnsToDisplay);
    this.dataSource = new MatTableDataSource<Registration>();
    this.getRegistrations(0, 50);
  }

  public showDeleteEntryDialog(entry: Registration): void {
    this.dialog.open(DeleteEntryDialogComponent, { width: '1000px', data: { registration: entry, activity: this.activity }}).afterClosed().subscribe({
      next: (deleted) => {
        if (deleted) {
          this.ngOnInit();
        }
      }
    });
  }

  private getRegistrations(page: number, limit: number): void {
    this.activitiesService.getRegistrations(this.activityId, limit, page).subscribe({
      next: registrations => {
        console.log(registrations);
        this.dataSource.data = registrations;
        this.totalItemsCount = this.activitiesService.itemsTotal;
      },
      error: () => this.snackBar.open(this.contentService.get('activities.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public onLoadMore(): void {
    this.getRegistrations(this.paginator.pageIndex, this.paginator.pageSize);
  }

  public getAnswer(question: Question, answers: Answer[]): string {
    for (const ans of answers) {
      if (ans.questionId == question.id) {
        if (question.type == QuestionTypes.CHECKBOX) {
          if (ans.text == '1') {
            return 'Ja';
          }
          else {
            return 'Nee';
          }
        }
        else {
          return ans.text;
        }
      }
    }
    return '-';
  }
}
