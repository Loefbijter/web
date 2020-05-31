import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ContentService } from '../../_modules/content/content.service';
import { FormErrorsService } from '../../_modules/form-errors/form-errors.service';
import { MaterialsService } from '../materials.service';
import { TOAST_DURATION, URL_REGEX } from '../../constants';
import { CreateMaterialDto, Material } from '../materials.model';

@Component({
  selector: 'app-edit-material-dialog',
  templateUrl: './edit-material-dialog.component.html',
  styleUrls: ['./edit-material-dialog.component.scss']
})
export class EditMaterialDialogComponent implements OnInit {

  public loading: boolean = false;
  public updateMaterialForm: FormGroup;
  public errors: ValidationErrors = { };

  public constructor(
    @Inject(MAT_DIALOG_DATA) public material: Material,
    public readonly dialogRef: MatDialogRef<EditMaterialDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly materialService: MaterialsService) {
  }

  public ngOnInit(): void {
    this.updateMaterialForm = this.fb.group({
      name: new FormControl(this.material.name, { validators: [Validators.required, Validators.maxLength(255)] }),
      image: new FormControl(this.material.imageUrl, { validators: [Validators.required, Validators.pattern(URL_REGEX)] }),
    });
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.loading = true;
      this.dialogRef.disableClose = true;
      const updatedMaterial: CreateMaterialDto = {
        name: this.updateMaterialForm.controls.name.value,
        imageUrl: this.updateMaterialForm.controls.image.value
      };
      this.materialService.update(this.material.id, updatedMaterial).subscribe({
        next: (material: Material) => {
          this.snackBar.open(this.contentService.get('material.update.success'), null, { duration: TOAST_DURATION });
          this.dialogRef.disableClose = false;
          this.dialogRef.close(material);
        },
        error: () => {
          this.snackBar.open(this.contentService.get('material.update.error'), null, { duration: TOAST_DURATION });
          this.loading = false;
          this.dialogRef.disableClose = false;
        }
      });
    }
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.updateMaterialForm);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`material.update.${fieldName}.error.${errorType}`);
    });
  }
}
