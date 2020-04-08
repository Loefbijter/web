import { NgModule, Injector } from '@angular/core';
import { ContentPipe } from './content.pipe';
import { ContentService } from './content.service';

@NgModule({
  declarations: [ContentPipe],
  providers: [ContentService],
  exports: [ContentPipe]
})
export class ContentModule {

  public static injector: Injector;

  public constructor(injector: Injector) {
    ContentModule.injector = injector;
  }
}
