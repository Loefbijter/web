import { NgModule } from '@angular/core';
import { MaterialDesignModule } from '../_helpers/material-design.module';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../_modules/content/content.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormErrorsModule } from '../_modules/form-errors/form-errors.module';
import { EditDamageDialogComponent } from './edit-damage-dialog/edit-damage-dialog.component';
import { DamageService } from './damage.service';

@NgModule({
  imports: [
    CommonModule,
    FormErrorsModule,
    MaterialDesignModule,
    ContentModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [
    EditDamageDialogComponent
  ],
  entryComponents: [
    EditDamageDialogComponent
  ],
  providers: [DamageService, MatNativeDateModule],
})
export class DamageModule { }
