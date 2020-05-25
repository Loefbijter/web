import { Injectable } from '@angular/core';
import { ContentItem } from '../_modules/content/content-item.model';
import { ContentService } from '../_modules/content/content.service';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = { 'date-format.until.text': 'tot', 'date-format.from.text': 'van'};

@Injectable({
  providedIn: 'root'
})
export class SimpleDateService {

  public constructor(private readonly contentService: ContentService) {
    this.contentService.addContentItems(content);
  }

  public formatDate(unixTime: number): string {
    return new Date(unixTime * 1000).toLocaleDateString();
  }

  public formatTime(unixTime: number): string {
    return new Date(unixTime * 1000).toLocaleTimeString();
  }

  public advancedFormatSameDate(starTimeStamp: number, endTimeStamp: number): string {
    const date: string = new Date(starTimeStamp * 1000).toLocaleDateString();
    const startTime: string = new Date(starTimeStamp * 1000).toLocaleTimeString();
    const endTime: string = new Date(endTimeStamp * 1000).toLocaleTimeString();
    return (
      date + ' ' + startTime.substring(0, startTime.lastIndexOf(':'))
      + ' ' + this.contentService.get('date-format.until.text') + ' ' +
      endTime.substring(0, endTime.lastIndexOf(':'))
    );
  }

  public advancedFormatDate(starTimeStamp: number, endTimeStamp: number): string {
    const startDate: string = new Date(starTimeStamp * 1000).toLocaleDateString();
    const endDate: string = new Date(endTimeStamp * 1000).toLocaleDateString();
    const startTime: string = new Date(starTimeStamp * 1000).toLocaleTimeString();
    const endTime: string = new Date(endTimeStamp * 1000).toLocaleTimeString();
    return (
      this.contentService.get('date-format.from.text') + ' '
      + startDate + ' ' + startTime.substring(0, startTime.lastIndexOf(':'))
      + ' ' + this.contentService.get('date-format.until.text') + ' '
      + endDate + ' ' + endTime.substring(0, endTime.lastIndexOf(':'))
    );
  }
}
