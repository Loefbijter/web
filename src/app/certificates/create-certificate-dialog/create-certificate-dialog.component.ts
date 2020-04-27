import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { FormErrorsService } from '../../_modules/form-errors/form-errors.service';
import { ContentService } from '../../_modules/content/content.service';
import { CertificatesService } from '../certificates.service';
import { CreateCertificateDto, Certificate } from '../certificates.model';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_DURATION } from '../../constants';

@Component({
  selector: 'app-create-certificate-dialog',
  templateUrl: './create-certificate-dialog.component.html',
  styleUrls: ['./create-certificate-dialog.component.scss']
})
export class CreateCertificateDialogComponent implements OnInit {

  public loading: boolean = false;
  public createForm: FormGroup;
  public errors: ValidationErrors = { };
  public formError: string;

  public constructor(
    public readonly dialogRef: MatDialogRef<CreateCertificateDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly certificatesService: CertificatesService,
    private readonly fb: FormBuilder,
    private readonly formErrorsService: FormErrorsService,
    private readonly contentService: ContentService
  ) { }

  public ngOnInit(): void {
    this.createForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.loading = true;
      this.dialogRef.disableClose = false;
      this.formError = undefined;
      const newCertificate: CreateCertificateDto = {
        name: this.createForm.controls.name.value
      };
      this.certificatesService.create(newCertificate).subscribe({
        next: (cert: Certificate) => {
          this.snackBar.open(this.contentService.get('create-certificate.success'), null, { duration: TOAST_DURATION });
          this.dialogRef.disableClose = false;
          this.dialogRef.close(cert);
        },
        error: err => {
          this.loading = false;
          if (err === 'Bad Request') {
            this.createForm.controls.name.setErrors({ unique: '' });
            this.formError = this.contentService.getInterpolated('create-certificate.name.error.unique', { name: newCertificate.name });
          } else {
            this.snackBar.open(this.contentService.get('create-certificate.error'), null, { duration: TOAST_DURATION });
            this.dialogRef.disableClose = false;
          }
        }
      });
    }
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.createForm);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`create-certificate.${fieldName}.error.${errorType}`);
    });
  }
}
