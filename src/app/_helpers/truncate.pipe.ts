import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  public transform(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }
}
