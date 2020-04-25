import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReservationsComponent } from './reservations.component';
import { ReservationsService } from './reservations.service';
import { MaterialModule } from '../_helpers/material.module';
import { AcceptanceReservationsComponent } from './acceptance-reservations/acceptance-reservations.component';
import { HomePageWidgetReservationsComponent } from './home-page-widget-reservations/home-page-widget-reservations.component';
import { ContentModule } from '../_modules/content/content.module';

const routes: Routes = [
  { path: '', component: ReservationsComponent },
];

@NgModule({
  declarations: [
    ReservationsComponent,
    AcceptanceReservationsComponent,
    HomePageWidgetReservationsComponent
  ],
  entryComponents: [
    AcceptanceReservationsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    ContentModule,
  ],
  providers: [ReservationsService],
  exports: [
    HomePageWidgetReservationsComponent
  ]
})
export class ReservationsModule { }
