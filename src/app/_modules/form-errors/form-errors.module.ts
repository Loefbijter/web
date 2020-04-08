import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormErrorsService } from './form-errors.service';
import { FormErrorsComponent } from './form-errors.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FormErrorsComponent],
  providers: [FormErrorsService],
  exports: [FormErrorsComponent]
})
export class FormErrorsModule { }
