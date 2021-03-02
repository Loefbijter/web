import { Component, Inject, OnInit } from '@angular/core';
import { Question, QuestionTypes } from './question.model';
import { ContentItem } from '../../_modules/content/content-item.model';
import { ContentService } from '../../_modules/content/content.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SimpleDateService } from '../../_helpers/simple-date.service';
import { QuestionManagementService } from './question-management.service';
import { Activity } from '../activity.model';
import { DeleteQuestionDialogComponent } from './delete-question-dialog/delete-question-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_DURATION } from '../../constants';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('../activities.content.json');

@Component({
  selector: 'app-question-management',
  templateUrl: './question-management.component.html',
  styleUrls: ['./question-management.component.scss']
})
export class QuestionManagementComponent implements OnInit {

  public questions: Question[] = [];
  // tslint:disable-next-line:no-any
  public questionTypes: any = QuestionTypes;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public activity: Activity,
    public readonly dialogRef: MatDialogRef<QuestionManagementComponent>,
    private readonly contentService: ContentService,
    public readonly simpleDateService: SimpleDateService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    public readonly questionService: QuestionManagementService
  ) {
  }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.questionService.getAllForActivity(this.activity.id).subscribe(result => {
      this.questions = result;
    });
  }

  public drop(event: CdkDragDrop<Question[]>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  public remove(index: number): void {
    if (!this.hasActivityStarted()) {
      this.dialog.open(DeleteQuestionDialogComponent, {width: '750px', data: this.questions[index]}).afterClosed().subscribe({
        next: (deleted) => {
          if (deleted) {
            this.questions.splice(index, 1);
          }
        }
      });
    }
    else {
      this.snackBar
        .open(this.contentService.get('activity.question-management.activity-started-new-question'), null, { duration: TOAST_DURATION });
    }
  }

  public addNewQuestion(): void {
    if (!this.hasActivityStarted()) {
      this.questions.push({ text: '', required: false, type: QuestionTypes.OPEN, order: this.questions.length});
    }
    else {
      this.snackBar
        .open(this.contentService.get('activity.question-management.activity-started-new-question'), null, { duration: TOAST_DURATION });
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public async save(): Promise<void> {
    if (!this.hasEmptyQuestions()) {
      let hasErrors: boolean = false;
      for (let i: number = 0; i < this.questions.length; i++) {
        if (this.questions[i].id) {
          const questionId: string = this.questions[i].id;
          const qId: string = this.questions[i].id;
          const aId: string = this.questions[i].activityId;
          this.questions[i].id = undefined;
          this.questions[i].activityId = undefined;
          this.questions[i].order = i;
          await this.questionService.update(questionId, this.questions[i]).toPromise().then(result => {
            this.questions[i] = result;
          }).catch(error => {
            this.questions[i].id = qId;
            this.questions[i].activityId = aId;
            hasErrors = true;
            this.snackBar
              .open(this.contentService.get('activity.question-management.error.save.text'), null, { duration: TOAST_DURATION });
          });
        }
        else {
          this.questions[i].order = i;
          await this.questionService.create(this.questions[i], this.activity.id).toPromise().then(result => {
            this.questions[i] = result;
          }).catch(error => {
            hasErrors = true;
            this.snackBar
              .open(this.contentService.get('activity.question-management.error.save.text'), null, { duration: TOAST_DURATION });
          });
        }
      }
      if (!hasErrors) {
        this.dialogRef.close();
        this.snackBar
          .open(this.contentService.get('activity.question-management.success.save.text'), null, { duration: TOAST_DURATION });
      }
    }
  }

  public hasEmptyQuestions(): boolean {
    let hasEmptyQuestions: boolean = false;
    this.questions.forEach(question => {
      if (!question.text || question.text == '') {
        hasEmptyQuestions = true;
        return;
      }
    });
    return hasEmptyQuestions;
  }

  public hasActivityStarted(): boolean {
    return this.activity.activeFrom <= Date.now() / 1000;
  }

}
