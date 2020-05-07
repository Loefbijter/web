import { Component, OnInit } from '@angular/core';
import { FormGroup, ValidationErrors, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ContentService } from '../_modules/content/content.service';
import { FormErrorsService } from '../_modules/form-errors/form-errors.service';
import { AuthService } from '../_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TOAST_DURATION } from '../constants';
import { ContentItem } from '../_modules/content/content-item.model';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./forgot-password.content.json');

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordForm: FormGroup;
  public loading: boolean = false;
  public errors: ValidationErrors = { };

  public constructor(
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) { }

  public get f(): { [key: string]: AbstractControl } {
    return this.forgotPasswordForm.controls;
  }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.forgotPasswordForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  public onSubmit(ev: Event): void {
    ev.preventDefault();
    if (this.isValid()) {
      this.loading = true;
      this.authService.resetPassword(this.forgotPasswordForm.controls.email.value).subscribe({
        next: () => {
          this.snackBar.open(this.contentService.get('forgot-password.success'), null, { duration: TOAST_DURATION });
          this.router.navigate(['login']);
        }
      });
    }
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.forgotPasswordForm);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`forgot-password.${fieldName}.error.${errorType}`);
    });
  }
}
