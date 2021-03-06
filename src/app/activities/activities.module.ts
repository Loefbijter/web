import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialDesignModule } from '../_helpers/material-design.module';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../_modules/content/content.module';
import { ActivitiesComponent } from './activities.component';
import { CreateActivityDialogComponent } from './create-activity-dialog/create-activity-dialog.component';
import { EditActivityDialogComponent } from './edit-activity-dialog/edit-activity-dialog.component';
import { DeleteActivityDialogComponent } from './delete-activity-dialog/delete-activity-dialog.component';
import { FormErrorsModule } from '../_modules/form-errors/form-errors.module';
import { ActivitiesService } from './activities.service';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { TruncatePipe } from '../_helpers/truncate.pipe';
import { QuestionManagementComponent } from './question-management/question-management.component';
import { DeleteQuestionDialogComponent } from './question-management/delete-question-dialog/delete-question-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RegistrationQuestionsAnswersComponent } from './registration-questions-answers/registration-questions-answers.component';
import { FormatAnswerPipe } from './format-answer.pipe';
import { ActivityEntriesComponent } from './activity-entries/activity-entries.component';
import { DeleteEntryDialogComponent } from './activity-entries/delete-entry-dialog/delete-entry-dialog.component';
import { MatTableExporterModule } from 'mat-table-exporter';

const routes: Routes = [
  { path: '', component: ActivitiesComponent },
  { path: ':id/entries', component: ActivityEntriesComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialDesignModule,
    ContentModule,
    FormErrorsModule,
    NgxMatDatetimePickerModule,
    DragDropModule,
    MatTableExporterModule
  ],
  declarations: [
    ActivitiesComponent,
    CreateActivityDialogComponent,
    EditActivityDialogComponent,
    DeleteActivityDialogComponent,
    QuestionManagementComponent,
    DeleteQuestionDialogComponent,
    RegistrationQuestionsAnswersComponent,
    FormatAnswerPipe,
    ActivityEntriesComponent,
    DeleteEntryDialogComponent,
  ],
  entryComponents: [
    CreateActivityDialogComponent,
    EditActivityDialogComponent,
    DeleteActivityDialogComponent,
    DeleteQuestionDialogComponent,
    QuestionManagementComponent,
  ],
  providers: [
    ActivitiesService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    TruncatePipe,
    FormatAnswerPipe,
  ],
  exports: [ActivitiesComponent]
})
export class ActivitiesModule { }
