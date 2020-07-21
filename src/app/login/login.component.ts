import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { first } from 'rxjs/operators';
import { FormErrorMap } from '../_modules/form-errors/form-errors.model';
import { FormErrorsService } from '../_modules/form-errors/form-errors.service';
import { ContentService } from '../_modules/content/content.service';
import { ContentItem } from '../_modules/content/content-item.model';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./login.content.json');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private returnUrl: string;
  public loginForm: FormGroup;
  public loginFailed: boolean = false;
  public loading: boolean = false;
  public errors: FormErrorMap = { };

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly formErrorsService: FormErrorsService,
    private readonly contentService: ContentService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
    this.contentService.addContentItems(content);
  }

  public ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      // tslint:disable no-unbound-method
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
      // tslint:enable no-unbound-method
    });
    // get the returnUrl from the route
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for form template
  public get f(): { [key: string]: AbstractControl } { return this.loginForm.controls; }

  public onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.isValid()) {
      return;
    }
    this.loginFailed = false;
    this.loading = true;
    this.authService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: () => {
          this.loginFailed = true;
          this.loading = false;
        }
      });
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.loginForm);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`login.${fieldName}.error.${errorType}`);
    });
  }
}
