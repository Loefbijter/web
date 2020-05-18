import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { News, PostNewsDto } from '../news.model';
import { ContentService } from 'src/app/_modules/content/content.service';
import { FormErrorsService } from 'src/app/_modules/form-errors/form-errors.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { URL_REGEX, TOAST_DURATION } from 'src/app/constants';
import { NewsService } from '../news.service';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-news-dialog',
  templateUrl: './edit-news-dialog.component.html',
  styleUrls: ['./edit-news-dialog.component.scss']
})
export class EditNewsDialogComponent implements OnInit {

  public form: FormGroup;
  public errors: ValidationErrors = { };
  public loading: boolean = false;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public news: News,
    public readonly dialogRef: MatDialogRef<EditNewsDialogComponent>,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly newsService: NewsService,
  ) { }

  public ngOnInit(): void {
    this.form = this.fb.group({
      title: new FormControl(this.news.title, [Validators.required, Validators.maxLength(255)]),
      text: new FormControl(this.news.text, [Validators.required, Validators.maxLength(65535)]),
      image: new FormControl(this.news.image, [Validators.pattern(URL_REGEX), Validators.maxLength(2083)]),
      publishedAt: new FormControl(this.news.publishedAt ? moment(this.news.publishedAt * 1000) : null)
    });
  }

  public get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.loading = true;
      this.dialogRef.disableClose = true;
      const updatedNews: PostNewsDto = {
        title: this.f.title.value,
        text: this.f.text.value
      };
      if (this.f.image.value) {
        updatedNews.image = this.f.image.value;
      }
      if (this.f.publishedAt.value || this.news.publishedAt) {
        updatedNews.publishedAt = this.f.publishedAt.value / 1000 || null;
      }
      this.newsService.update(this.news.id, updatedNews).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackBar.open(this.contentService.get('edit-news.success'), null, { duration: TOAST_DURATION });
        },
        error: () => {
          this.loading = false;
          this.dialogRef.disableClose = true;
          this.snackBar.open(this.contentService.get('edit-news.error'), null, { duration: TOAST_DURATION });
        }
      });
    }
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.form);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`edit-news.${fieldName}.error.${errorType}`);
    });
  }
}
