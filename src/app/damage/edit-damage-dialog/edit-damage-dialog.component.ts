import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, ValidationErrors, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Damage, UpdateDamageDto } from '../damage.model';
import { DamageService } from '../damage.service';
import { ContentService } from '../../_modules/content/content.service';
import { FormErrorsService } from '../../_modules/form-errors/form-errors.service';
import { ContentItem } from '../../_modules/content/content-item.model';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('../damage.content.json');

@Component({
  selector: 'app-edit-damage-dialog',
  templateUrl: './edit-damage-dialog.component.html',
  styleUrls: ['./edit-damage-dialog.component.scss']
})
export class EditDamageDialogComponent implements OnInit {

  public loading: boolean = false;
  public editDamageForm: FormGroup;
  public errors: ValidationErrors = { };

  public constructor(
    @Inject(MAT_DIALOG_DATA) public damage: Damage,
    public readonly dialogRef: MatDialogRef<EditDamageDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly damageService: DamageService
  ) { }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.editDamageForm = this.fb.group({
      description: new FormControl(this.damage.description, { validators: [Validators.required] }),
      resolvedAt: new FormControl(this.damage.resolvedAt)
    });
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.loading = true;
      this.dialogRef.disableClose = true;
      const resolvedDate: Date = this.editDamageForm.controls.resolvedAt.value ?
      this.editDamageForm.controls.resolvedAt.value : undefined;
      const updatedDamageValues: UpdateDamageDto = {
        description: this.editDamageForm.controls.description.value,
        resolvedAt: resolvedDate,
      };
      this.damageService.update(this.damage.id, updatedDamageValues).subscribe({
        next: (editedDamage: Damage) => {
          this.snackBar.open(this.contentService.get('edit-damage.success'), null, { duration: 5000 });
          this.loading = false;
          // Signal back that the edit was successful
          this.dialogRef.close(editedDamage);
        },
        error: () => {
          this.snackBar.open(this.contentService.get('edit-damage.error'), null, { duration: 5000 });
          this.loading = false;
          this.dialogRef.disableClose = false;
        }
      });
    }
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`edit-damage.${fieldName}.error.${errorType}`);
    });
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.editDamageForm);
  }
}
