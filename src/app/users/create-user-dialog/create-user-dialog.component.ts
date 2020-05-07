import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ContentService } from 'src/app/_modules/content/content.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormErrorsService } from 'src/app/_modules/form-errors/form-errors.service';
import { UsersService } from '../users.service';
import { CreateUserDto, User } from '../users.model';
import { CHARS, TOAST_DURATION } from 'src/app/constants';
import { UserRole } from 'src/app/_helpers/auth.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})
export class CreateUserDialogComponent implements OnInit {

  public createForm: FormGroup;
  public errors: ValidationErrors = { };
  public loading: boolean = false;
  public error: string;

  public constructor(
    public readonly dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly usersService: UsersService,
    private readonly formErrorsService: FormErrorsService,
    private readonly snackBar: MatSnackBar,
    private readonly authService: AuthService,
  ) { }

  public get roles(): string[] {
    return Object.keys(UserRole).filter(k => !isNaN(Number(k)));
  }

  public ngOnInit(): void {
    this.createForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      role: new FormControl('', [Validators.required])
    });
  }

  public get f(): { [key: string]: AbstractControl } {
    return this.createForm.controls;
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.dialogRef.disableClose = true;
      this.loading = true;
      const newUser: CreateUserDto = {
        name: this.createForm.controls.name.value,
        email: this.createForm.controls.email.value,
        password: this.randomString(20),
        role: parseInt(this.createForm.controls.role.value)
      };
      this.usersService.create(newUser).subscribe({
        next: (u: User) => {
          this.authService.resetPassword(u.email).subscribe({
            next: () => {
              this.loading = false;
              this.snackBar.open(this.contentService.get('create-user.success'), null, { duration: TOAST_DURATION });
              this.dialogRef.close(u);
            },
            error: () => {
              this.loading = false;
              this.snackBar.open(this.contentService.get('create-user.error.mail'), null, { duration: TOAST_DURATION });
              this.dialogRef.close(u);
            }
          });
        },
        error: (e) => {
          this.loading = false;
          this.dialogRef.disableClose = false;
          if (e == 'Bad Request') {
            this.createForm.controls.email.setErrors({ unique: '' });
            this.error = this.contentService.getInterpolated('create-user.email.error.unique', { email: newUser.email });
          } else {
            this.snackBar.open(this.contentService.get('create-user.error'), null, { duration: TOAST_DURATION });
          }
        }
      });
    }
  }

  public isValid(): boolean {
    return this.formErrorsService.verify(this.createForm);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`create-user.${fieldName}.error.${errorType}`);
    });
  }

  private randomString(length: number): string {
    let str: string = '';
    for (let i: number = 0; i < length; i++) {
      const ran: number = Math.floor(Math.random() * CHARS.length);
      str += CHARS[ran];
    }
    return str;
  }
}
