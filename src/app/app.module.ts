import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { MaterialDesignModule } from './_helpers/material-design.module';
import { FormErrorsModule } from './_modules/form-errors/form-errors.module';
import { ContentModule } from './_modules/content/content.module';
import { LoginComponent } from './login/login.component';
import { BoatsModule } from './boats/boats.module';
import { CommonModule, registerLocaleData } from '@angular/common';
import { CertificatesModule } from './certificates/certificates.module';
import { DamageModule } from './damage/damage.module';
import { ReservationsModule } from './reservations/reservations.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import localeNl from '@angular/common/locales/nl';
import localeNlExtra from '@angular/common/locales/extra/nl';
import { SetPasswordComponent } from './set-password/set-password.component';
import { UsersModule } from './users/users.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './paginator-dutch-intl';
import { NewsModule } from './news/news.module';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { ActivitiesModule } from './activities/activities.module';
import { MaterialsModule } from './material/materials.module';
import { MaterialReservationsModule } from './material-reservations/material-reservations.module';
import { PasswordSetComponent } from "./password-set/password-set.component";

registerLocaleData(localeNl, 'nl-NL', localeNlExtra);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SetPasswordComponent,
    ForgotPasswordComponent,
    PasswordSetComponent,
  ],
  imports: [
    CommonModule,
    MaterialDesignModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormErrorsModule,
    ContentModule,
    AppRoutingModule,
    HttpClientModule,
    BoatsModule,
    CertificatesModule,
    DamageModule,
    ReservationsModule,
    UsersModule,
    FlexLayoutModule,
    NewsModule,
    NgxMatMomentModule,
    ActivitiesModule,
    MaterialsModule,
    MaterialReservationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() },
    { provide: LOCALE_ID, useValue: 'nl-NL' },
  ],
  bootstrap: [AppComponent],
  exports: [
    ContentModule,
  ]
})
export class AppModule { }
