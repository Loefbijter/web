import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialReservationsComponent } from './material-reservations.component';
import { MaterialReservationsService } from './material-reservations.service';
import { MaterialReservationHomeWidgetComponent } from './home-widget/material-reservation-home-widget.component';
import { StatusUpdateDialogComponent } from './status-update-dialog/status-update-dialog.component';
import { FormErrorsModule } from '../_modules/form-errors/form-errors.module';
import { MaterialDesignModule } from '../_helpers/material-design.module';
import { ContentModule } from '../_modules/content/content.module';

const routes: Routes = [
  { path: '', component: MaterialReservationsComponent }
];

@NgModule({
  declarations: [
    MaterialReservationsComponent,
    MaterialReservationHomeWidgetComponent,
    StatusUpdateDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormErrorsModule,
    MaterialDesignModule,
    ContentModule,
  ],
  entryComponents: [
    StatusUpdateDialogComponent
  ],
  providers: [
    MaterialReservationsService
  ],
  exports: [
    MaterialReservationHomeWidgetComponent
  ]
})
export class MaterialReservationsModule { }
