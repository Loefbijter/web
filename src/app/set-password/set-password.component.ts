import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationErrors, FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ContentService } from '../_modules/content/content.service';
import { ContentItem } from '../_modules/content/content-item.model';
import { FormErrorsService } from '../_modules/form-errors/form-errors.service';
import { MustMatch } from '../_helpers/must-match.validator';
import { SetPasswordDto } from './set-password.model';
import { AuthService } from '../_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_DURATION } from '../constants';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./set-password.content.json');

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {

  public setPasswordForm: FormGroup;
  public errors: ValidationErrors = { };
  public loading: boolean = false;
  public error: string;

  public constructor(
    public readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) { }

  public ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.authService.logout();
    }
    this.contentService.addContentItems(content);
    this.setPasswordForm = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, {
      validators: [MustMatch('password', 'confirmPassword')]
    });
  }

  public get f(): { [key: string]: AbstractControl } {
    return this.setPasswordForm.controls;
  }

  public onSubmit(ev: Event): void {
    ev.preventDefault();
    if (this.isValid()) {
      this.loading = true;
      this.error = undefined;
      const token: string = this.route.snapshot.paramMap.get('token');
      const dto: SetPasswordDto = { token, password: this.f.password.value };
      this.authService.setPassword(dto).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open(this.contentService.get('set-password.success'), null, { duration: TOAST_DURATION });
          this.router.navigate(['password-set']);
        },
        error: () => {
          this.loading = false;
          this.error = this.contentService.get('set-password.error');
        }
      });
    }
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.setPasswordForm);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`set-password.${fieldName}.error.${errorType}`);
    });
  }
}
