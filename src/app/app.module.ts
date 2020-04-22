import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { MaterialModule } from './_helpers/material.module';
import { FormErrorsModule } from './_modules/form-errors/form-errors.module';
import { ContentModule } from './_modules/content/content.module';

import { LoginComponent } from './login/login.component';
import { BoatsModule } from './boats/boats.module';
import { CommonModule } from '@angular/common';
import { CertificatesModule } from './certificates/certificates.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormErrorsModule,
    ContentModule,
    AppRoutingModule,
    HttpClientModule,
    BoatsModule,
    CertificatesModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  exports: [
    ContentModule
  ]
})
export class AppModule { }
