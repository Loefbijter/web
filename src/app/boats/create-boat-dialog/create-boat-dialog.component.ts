import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ContentService } from '../../_modules/content/content.service';
import { FormErrorsService } from '../../_modules/form-errors/form-errors.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BoatsService } from '../boats.service';
import { CreateBoatDto, Boat } from '../boats.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CertificatesService } from '../../../app/certificates/certificates.service';
import { Certificate } from '../../../app/certificates/certificates.model';
import { URL_REGEX, TOAST_DURATION } from '../../constants';

@Component({
  selector: 'app-create-boat-dialog',
  templateUrl: './create-boat-dialog.component.html',
  styleUrls: ['./create-boat-dialog.component.scss']
})
export class CreateBoatDialogComponent implements OnInit {

  public loading: boolean = false;
  public certificates: Certificate[];
  public createBoatForm: FormGroup;
  public errors: ValidationErrors = { };

  public constructor(
    public readonly dialogRef: MatDialogRef<CreateBoatDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly boatsService: BoatsService,
    private readonly certificatesService: CertificatesService
  ) { }

  public ngOnInit(): void {
    this.createBoatForm = this.fb.group({
      name: new FormControl('', { validators: [Validators.required, Validators.maxLength(255)] }),
      image: new FormControl('', { validators: [Validators.required, Validators.pattern(URL_REGEX)] }),
      type: new FormControl('', { validators: [Validators.required, Validators.maxLength(255)] }),
      certificate: new FormControl('', { validators: [Validators.required] })
    });
    this.certificatesService.getAllComplete().subscribe({
      next: certs => this.certificates = certs
    });
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.loading = true;
      this.dialogRef.disableClose = true;
      const newBoat: CreateBoatDto = {
        name: this.createBoatForm.controls.name.value,
        image: this.createBoatForm.controls.image.value,
        type: this.createBoatForm.controls.type.value,
        certificateId: this.createBoatForm.controls.certificate.value
      };
      this.boatsService.create(newBoat).subscribe({
        next: (boat: Boat) => {
          this.snackBar.open(this.contentService.get('create-boat.success'), null, { duration: TOAST_DURATION });
          this.dialogRef.disableClose = false;
          this.dialogRef.close(boat);
        },
        error: () => {
          this.snackBar.open(this.contentService.get('create-boat.error'), null, { duration: TOAST_DURATION });
          this.loading = false;
          this.dialogRef.disableClose = false;
        }
      });
    }
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.createBoatForm);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`create-boat.${fieldName}.error.${errorType}`);
    });
  }
}
