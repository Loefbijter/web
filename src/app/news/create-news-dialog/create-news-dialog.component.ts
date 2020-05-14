import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ContentService } from 'src/app/_modules/content/content.service';
import { FormErrorsService } from 'src/app/_modules/form-errors/form-errors.service';
import { PostNewsDto } from '../news.model';
import { URL_REGEX, TOAST_DURATION } from 'src/app/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-create-news-dialog',
  templateUrl: './create-news-dialog.component.html',
  styleUrls: ['./create-news-dialog.component.scss']
})
export class CreateNewsDialogComponent implements OnInit {

  public form: FormGroup;
  public errors: ValidationErrors = { };
  public loading: boolean = false;

  public constructor(
    public readonly dialogRef: MatDialogRef<CreateNewsDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly newsService: NewsService,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    this.form = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      text: new FormControl('', [Validators.required, Validators.maxLength(65535)]),
      image: new FormControl('', [Validators.pattern(URL_REGEX), Validators.maxLength(2083)]),
      publishedAt: new FormControl(moment(new Date()))
    });
  }

  public get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.loading = true;
      this.dialogRef.disableClose = true;
      const newNews: PostNewsDto = {
        title: this.f.title.value,
        text: this.f.text.value
      };
      if (this.f.image.value) {
        newNews.image = this.f.image.value;
      }
      if (this.f.publishedAt.value) {
        newNews.publishedAt = this.f.publishedAt.value / 1000;
      }
      this.newsService.create(newNews).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackBar.open(this.contentService.get('create-news.success'), null, { duration: TOAST_DURATION });
        },
        error: () => {
          this.loading = false;
          this.dialogRef.disableClose = true;
          this.snackBar.open(this.contentService.get('create-news.error'), null, { duration: TOAST_DURATION });
        }
      });
    }
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.form);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`create-news.${fieldName}.error.${errorType}`);
    });
  }
}
