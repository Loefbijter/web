import { NgModule } from '@angular/core';
import { CreateNewsDialogComponent } from './create-news-dialog/create-news-dialog.component';
import { EditNewsDialogComponent } from './edit-news-dialog/edit-news-dialog.component';
import { DeleteNewsDialogComponent } from './delete-news-dialog/delete-news-dialog.component';
import { NewsComponent } from './news.component';
import { NewsService } from './news.service';
import { Routes, RouterModule } from '@angular/router';
import { ContentModule } from '../_modules/content/content.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../_helpers/material.module';
import { FormErrorsModule } from '../_modules/form-errors/form-errors.module';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { TruncatePipe } from '../_helpers/truncate.pipe';
import { ShowNewsDialogComponent } from './show-news-dialog/show-news-dialog.component';

const routes: Routes = [
  { path: '', component: NewsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    ContentModule,
    FormErrorsModule,
    NgxMatDatetimePickerModule,
  ],
  declarations: [
    NewsComponent,
    CreateNewsDialogComponent,
    ShowNewsDialogComponent,
    EditNewsDialogComponent,
    DeleteNewsDialogComponent,
    TruncatePipe,
  ],
  entryComponents: [
    CreateNewsDialogComponent,
    ShowNewsDialogComponent,
    EditNewsDialogComponent,
    DeleteNewsDialogComponent,
  ],
  providers: [
    NewsService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    TruncatePipe,
  ]
})
export class NewsModule { }
