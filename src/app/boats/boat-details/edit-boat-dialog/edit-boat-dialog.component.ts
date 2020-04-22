import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, ValidationErrors, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../../_modules/content/content.service';
import { FormErrorsService } from '../../../_modules/form-errors/form-errors.service';
import { BoatsService } from '../../boats.service';
import { Boat, CreateBoatDto } from '../../boats.model';
import { CertificatesService } from '../../../certificates/certificates.service';
import { Certificate } from '../../../certificates/certificates.model';
import { URL_REGEX, TOAST_DURATION } from '../../../constants';

@Component({
  selector: 'app-edit-boat-dialog',
  templateUrl: './edit-boat-dialog.component.html',
  styleUrls: ['./edit-boat-dialog.component.scss']
})
export class EditBoatDialogComponent implements OnInit {

  public loading: boolean = false;
  public certificates: Certificate[];
  public editBoatForm: FormGroup;
  public errors: ValidationErrors = { };

  public constructor(
    @Inject(MAT_DIALOG_DATA) public boat: Boat,
    public readonly dialogRef: MatDialogRef<EditBoatDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly boatsService: BoatsService,
    private readonly certificatesService: CertificatesService
  ) { }

  public ngOnInit(): void {
    this.certificatesService.getAllComplete().subscribe({
      next: certs => {
        this.certificates = certs;
      }
    });
    this.editBoatForm = this.fb.group({
      name: new FormControl(this.boat.name, { validators: [Validators.required, Validators.maxLength(255)] }),
      image: new FormControl(this.boat.image, { validators: [Validators.required, Validators.pattern(URL_REGEX)] }),
      type: new FormControl(this.boat.type, { validators: [Validators.required, Validators.maxLength(255)] }),
      certificate: new FormControl(this.boat.requiredCertificate.id, { validators: [Validators.required] })
    });
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.loading = true;
      this.dialogRef.disableClose = true;
      const newBoatValues: CreateBoatDto = {
        name: this.editBoatForm.controls.name.value,
        type: this.editBoatForm.controls.type.value,
        image: this.editBoatForm.controls.image.value,
        certificateId: this.editBoatForm.controls.certificate.value
      };
      this.boatsService.update(this.boat.id, newBoatValues).subscribe({
        next: (editedBoat: Boat) => {
          this.snackBar.open(this.contentService.get('edit-boat.success'), null, { duration: TOAST_DURATION });
          this.loading = false;
          // Signal back that the edit was successful
          this.dialogRef.close(editedBoat);
        },
        error: () => {
          this.snackBar.open(this.contentService.get('edit-boat.error'), null, { duration: TOAST_DURATION });
          this.loading = false;
          this.dialogRef.disableClose = false;
        }
      });
    }
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`edit-boat.${fieldName}.error.${errorType}`);
    });
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.editBoatForm);
  }
}
