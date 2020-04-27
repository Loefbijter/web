import { NgModule } from '@angular/core';
import { CertificatesService } from './certificates.service';
import { CertificatesComponent } from './certificates.component';
import { Routes, RouterModule } from '@angular/router';
import { FormErrorsModule } from '../_modules/form-errors/form-errors.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../_helpers/material.module';
import { ContentModule } from '../_modules/content/content.module';
import { CreateCertificateDialogComponent } from './create-certificate-dialog/create-certificate-dialog.component';
import { EditCertificateDialogComponent } from './edit-certificate-dialog/edit-certificate-dialog.component';
import { DeleteCertificateDialogComponent } from './delete-certificate-dialog/delete-certificate-dialog.component';

const routes: Routes = [
  { path: '', component: CertificatesComponent },
  { path: ':id', component: CertificatesComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormErrorsModule,
    MaterialModule,
    ContentModule,
  ],
  entryComponents: [
    CreateCertificateDialogComponent,
    EditCertificateDialogComponent,
    DeleteCertificateDialogComponent,
  ],
  declarations: [
    CertificatesComponent,
    CreateCertificateDialogComponent,
    EditCertificateDialogComponent,
    DeleteCertificateDialogComponent,
  ],
  providers: [CertificatesService]
})
export class CertificatesModule { }
