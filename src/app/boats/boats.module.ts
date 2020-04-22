import { NgModule } from '@angular/core';
import { BoatsComponent } from './boats.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../_helpers/material.module';
import { BoatDetailsComponent } from './boat-details/boat-details.component';
import { BoatsService } from './boats.service';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../_modules/content/content.module';
import { CreateBoatDialogComponent } from './create-boat-dialog/create-boat-dialog.component';
import { FormErrorsModule } from '../_modules/form-errors/form-errors.module';
import { DeleteBoatDialogComponent } from './boat-details/delete-boat-dialog/delete-boat-dialog.component';
import { EditBoatDialogComponent } from './boat-details/edit-boat-dialog/edit-boat-dialog.component';

const routes: Routes = [
  { path: '', component: BoatsComponent },
  { path: ':id', component: BoatDetailsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormErrorsModule,
    MaterialModule,
    ContentModule,
  ],
  declarations: [
    BoatsComponent,
    BoatDetailsComponent,
    CreateBoatDialogComponent,
    DeleteBoatDialogComponent,
    EditBoatDialogComponent
  ],
  entryComponents: [
    CreateBoatDialogComponent,
    DeleteBoatDialogComponent,
    EditBoatDialogComponent
  ],
  providers: [BoatsService],
  exports: [BoatsComponent]
})
export class BoatsModule { }
