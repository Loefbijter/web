import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, ValidationErrors, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User, CreateUserDto } from '../../users.model';
import { ContentService } from '../../../_modules/content/content.service';
import { FormErrorsService } from '../../../_modules/form-errors/form-errors.service';
import { UserRole } from '../../../_helpers/auth.model';
import { UsersService } from '../../users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_DURATION } from '../../../constants';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {

  public editForm: FormGroup;
  public errors: ValidationErrors = { };
  public loading: boolean = false;
  public error: string;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public readonly user: User,
    public readonly dialogRef: MatDialogRef<EditUserDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly usersService: UsersService,
    private readonly snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    this.editForm = this.fb.group({
      name: new FormControl(this.user.name, [Validators.required, Validators.maxLength(255)]),
      email: new FormControl(this.user.email, [Validators.required, Validators.email, Validators.maxLength(255)]),
      role: new FormControl(this.user.role, [Validators.required])
    });
  }

  public get roles(): number[] {
    return Object.keys(UserRole).filter(k => !isNaN(Number(k))).map(v => parseInt(v));
  }

  public get f(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.dialogRef.disableClose = true;
      this.loading = true;
      const updatedUser: CreateUserDto = {
        name: this.editForm.controls.name.value,
        role: this.editForm.controls.role.value
      };
      if (this.editForm.controls.email.value !== this.user.email) {
        updatedUser.email = this.editForm.controls.email.value;
      }
      this.usersService.update(this.user.id, updatedUser).subscribe({
        next: (u: User) => {
          this.loading = false;
          this.dialogRef.close(u);
          this.snackBar.open(this.contentService.get('edit-user.success'), null, { duration: TOAST_DURATION });
        },
        error: (e) => {
          this.loading = false;
          this.dialogRef.disableClose = false;
          if (e == 'Bad Request') {
            this.editForm.controls.email.setErrors({ unique: '' });
            this.error = this.contentService.getInterpolated('edit-user.email.error.unique', { email: updatedUser.email });
          } else {
            this.snackBar.open(this.contentService.get('edit-user.error'), null, { duration: TOAST_DURATION });
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
      return this.contentService.get(`edit-user.${fieldName}.error.${errorType}`);
    });
  }
}
