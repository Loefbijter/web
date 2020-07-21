import { Component, OnInit } from '@angular/core';
import { FormGroup, ValidationErrors, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MaterialsService } from '../materials.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { FormErrorsService } from '../../_modules/form-errors/form-errors.service';
import { URL_REGEX, TOAST_DURATION } from '../../constants';
import { CreateMaterialDto, Material } from '../materials.model';

@Component({
  selector: 'app-create-material-dialog',
  templateUrl: './create-material-dialog.component.html',
  styleUrls: ['./create-material-dialog.component.scss']
})
export class CreateMaterialDialogComponent implements OnInit {

  public loading: boolean = false;
  public createMaterialForm: FormGroup;
  public errors: ValidationErrors = { };

  public constructor(
    public readonly dialogRef: MatDialogRef<CreateMaterialDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly materialService: MaterialsService
  ) {
  }

  public ngOnInit(): void {
    this.createMaterialForm = this.fb.group({
      name: new FormControl('', { validators: [Validators.required, Validators.maxLength(255)] }),
      image: new FormControl('', { validators: [Validators.required, Validators.pattern(URL_REGEX)] }),
    });
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.loading = true;
      this.dialogRef.disableClose = true;
      const newMaterial: CreateMaterialDto = {
        name: this.createMaterialForm.controls.name.value,
        imageUrl: this.createMaterialForm.controls.image.value
      };
      this.materialService.create(newMaterial).subscribe({
        next: (material: Material) => {
          this.loading = false;
          this.snackBar.open(this.contentService.get('material.create.success'), null, { duration: TOAST_DURATION });
          this.dialogRef.disableClose = false;
          this.dialogRef.close(material);
        },
        error: () => {
          this.snackBar.open(this.contentService.get('material.create.error'), null, { duration: TOAST_DURATION });
          this.loading = false;
          this.dialogRef.disableClose = false;
        }
      });
    }
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.createMaterialForm);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`material.create.${fieldName}.error.${errorType}`);
    });
  }
}
