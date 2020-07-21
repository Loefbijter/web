import { Pipe, PipeTransform } from '@angular/core';
import { ContentService } from './content.service';

@Pipe({ name: 'content' })
export class ContentPipe implements PipeTransform {

  public constructor(private readonly contentService: ContentService) { }

  public transform(key: string, params?: { [key: string]: string }): string {
    return this.contentService.getInterpolated(key, params);
  }
}
