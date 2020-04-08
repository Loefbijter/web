import { Injectable } from '@angular/core';
import { ContentItem } from './content-item.model';

@Injectable()
export class ContentService {

  private readonly contentItems: ContentItem = { };

  public addContentItems(contentItems: ContentItem): void {
    Object.keys(contentItems).forEach(key => {
      this.contentItems[key] = contentItems[key];
    });
  }

  public removeContentItems(contentItems: ContentItem): void {
    Object.keys(contentItems).forEach(key => {
      // tslint:disable-next-line: no-dynamic-delete
      delete this.contentItems[key];
    });
  }

  public get(key: string): string {
    const contentItem: string = this.contentItems[key];
    return contentItem ? contentItem : key;
  }

  public interpolate(value: string, params: { [key: string]: string }): string {
    return value.replace(/\${(\w+?)}/g, (_, v) => params[v]);
  }

  public getInterpolated(key: string, params: { [key: string]: string }): string {
    const value: string = this.get(key);
    return this.interpolate(value, params);
  }
}
