import { PipeTransform, Pipe } from '@angular/core';
import { QuestionTypes } from './question-management/question.model';
import { ContentService } from '../_modules/content/content.service';

@Pipe({ name: 'formatAnswer' })
export class FormatAnswerPipe implements PipeTransform {

  public constructor(
    private readonly contentService: ContentService,
  ) { }

  public transform(value: string, questionType: QuestionTypes): string {
    if (!value) {
      return this.contentService.get('format-answer.undefined-answer');
    }
    switch (questionType) {
      case QuestionTypes.CHECKBOX:
        return value === '0' ? this.contentService.get('format-answer.checkbox.no') : this.contentService.get('format-answer.checkbox.yes');
      case QuestionTypes.NUMBER:
        return value;
      case QuestionTypes.OPEN:
        return value;
      case QuestionTypes.SHORT:
        return value;
      default:
        return value;
    }
  }
}
