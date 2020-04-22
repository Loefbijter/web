import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormErrorsService } from './form-errors.service';
import { FormErrorsComponent } from './form-errors.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [FormErrorsComponent],
  providers: [FormErrorsService],
  exports: [
    FormErrorsComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FormErrorsModule { }
