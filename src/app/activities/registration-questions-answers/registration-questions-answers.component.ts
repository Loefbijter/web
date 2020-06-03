import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentService } from '../../_modules/content/content.service';
import { ActivitiesService } from '../activities.service';
import { Registration } from '../activity.model';
import { QuestionManagementService } from '../question-management/question-management.service';
import { Question } from '../question-management/question.model';
import { ContentItem } from '../../_modules/content/content-item.model';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./registration-questions-answers.content.json');

@Component({
  selector: 'app-registration-questions-answers',
  templateUrl: './registration-questions-answers.component.html',
  styleUrls: ['./registration-questions-answers.component.scss']
})
export class RegistrationQuestionsAnswersComponent implements OnInit {
  @Input() public registration: Registration;
  public questions$: Observable<Question[]>;
  private readonly answers: Map<string, string> = new Map();

  public constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly questionsService: QuestionManagementService,
    private readonly contentService: ContentService,
  ) { }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.activitiesService.getRegistration(this.registration.id).subscribe({
      next: res => res.answers.forEach(a => this.answers.set(a.questionId, a.text))
    });
    this.questions$ = this.questionsService.getAllForActivity(this.registration.activityId);
  }

  public getAnswer(questionId: string): string {
    return this.answers.get(questionId);
  }
}
