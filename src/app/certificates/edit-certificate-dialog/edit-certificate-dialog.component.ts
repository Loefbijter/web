import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_DURATION } from 'src/app/constants';
import { ContentService } from '../../_modules/content/content.service';
import { FormErrorsService } from '../../_modules/form-errors/form-errors.service';
import { Certificate, PatchCertificateDto } from '../certificates.model';
import { CertificatesService } from '../certificates.service';

@Component({
  selector: 'app-edit-certificate-dialog',
  templateUrl: './edit-certificate-dialog.component.html',
  styleUrls: ['./edit-certificate-dialog.component.scss']
})
export class EditCertificateDialogComponent implements OnInit {

  public loading: boolean = false;
  public editForm: FormGroup;
  public formError: string;
  public errors: ValidationErrors = { };

  public constructor(
    @Inject(MAT_DIALOG_DATA) public certificate: Certificate,
    public readonly dialogRef: MatDialogRef<EditCertificateDialogComponent>,
    private readonly certificatesService: CertificatesService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly fb: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.editForm = this.fb.group({
      name: new FormControl(this.certificate.name, [Validators.required, Validators.maxLength(255)]),
      showInSkippersList: new FormControl(this.certificate.showInSkippersList, [Validators.required])
    });
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.loading = true;
      this.dialogRef.disableClose = true;
      const editedCertificate: PatchCertificateDto = { };
      if (this.editForm.controls.name.value !== this.certificate.name) editedCertificate.name = this.editForm.controls.name.value;
      if (this.editForm.controls.showInSkippersList.value !== this.certificate.showInSkippersList) {
        editedCertificate.showInSkippersList = this.editForm.controls.showInSkippersList.value;
      }
      this.certificatesService.update(this.certificate.id, editedCertificate).subscribe({
        next: newValues => {
          this.snackBar.open(this.contentService.get('edit-certificate.success'), null, { duration: TOAST_DURATION });
          this.dialogRef.disableClose = false;
          this.dialogRef.close(newValues);
        },
        error: err => {
          this.loading = false;
          this.dialogRef.disableClose = false;
          if (err === 'Bad Request') {
            this.editForm.controls.name.setErrors({ unique: '' });
            this.formError = this.contentService.getInterpolated('edit-certificate.name.error.unique', { name: editedCertificate.name });
          } else {
            this.snackBar.open(this.contentService.get('edit-certificate.error'), null, { duration: TOAST_DURATION });
          }
        }
      });
    }
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.editForm);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`edit-certificate.${fieldName}.error.${errorType}`);
    });
  }
}
