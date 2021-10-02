import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReservationsComponent } from './reservations.component';
import { ReservationsService } from './reservations.service';
import { MaterialDesignModule } from '../_helpers/material-design.module';
import { AcceptanceReservationsComponent } from './acceptance-reservations/acceptance-reservations.component';
import { HomePageWidgetReservationsComponent } from './home-page-widget-reservations/home-page-widget-reservations.component';
import { ContentModule } from '../_modules/content/content.module';
import { DeleteBoatReservationDialogComponent } from './delete-boat-reservation-dialog/delete-boat-reservation-dialog.component';
import { MatTableExporterModule } from 'mat-table-exporter';

const routes: Routes = [
  { path: '', component: ReservationsComponent },
];

@NgModule({
  declarations: [
    ReservationsComponent,
    AcceptanceReservationsComponent,
    HomePageWidgetReservationsComponent,
    DeleteBoatReservationDialogComponent,
  ],
  entryComponents: [
    AcceptanceReservationsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialDesignModule,
    ContentModule,
    MatTableExporterModule,
  ],
  providers: [ReservationsService],
  exports: [
    HomePageWidgetReservationsComponent
  ]
})
export class ReservationsModule { }
