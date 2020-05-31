import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsComponent } from './materials.component';
import { MaterialDetailComponent } from './material-detail/material-detail.component';
import { CreateMaterialDialogComponent } from './create-dialog/create-material-dialog.component';
import { EditMaterialDialogComponent } from './edit-dialog/edit-material-dialog.component';
import { RemoveMaterialDialogComponent } from './remove-dialog/remove-material-dialog.component';
import { FormErrorsModule } from '../_modules/form-errors/form-errors.module';
import { ContentModule } from '../_modules/content/content.module';
import { MaterialDesignModule } from '../_helpers/material-design.module';
import { MaterialsService } from './materials.service';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: MaterialsComponent },
  { path: 'details/:materialID', component: MaterialDetailComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormErrorsModule,
    MaterialDesignModule,
    ContentModule
  ],
  declarations: [
    MaterialsComponent,
    MaterialDetailComponent,
    CreateMaterialDialogComponent,
    EditMaterialDialogComponent,
    RemoveMaterialDialogComponent
  ],
  entryComponents: [
    CreateMaterialDialogComponent,
    EditMaterialDialogComponent,
    RemoveMaterialDialogComponent
  ],
  providers: [
    MaterialsService
  ]
})
export class MaterialsModule { }
