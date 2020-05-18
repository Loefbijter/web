import { Component, OnInit } from '@angular/core';
import { FormGroup, ValidationErrors, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivitiesService } from '../activities.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { FormErrorsService } from '../../_modules/form-errors/form-errors.service';
import { URL_REGEX, TOAST_DURATION } from '../../constants';
import { Activity, CreateActivityDto } from '../activity.model';
import {
  checkIfEndTimeAfterStartTime,
  checkIfActiveFromBeforeStartTime,
  checkIfActiveUntilAfterActiveFrom,
  checkIfStartTimeIsInPast,
  checkIfActiveFromIsInPast,
} from '../activities.validators';

@Component({
  selector: 'app-create-activity-dialog',
  templateUrl: './create-activity-dialog.component.html',
  styleUrls: ['./create-activity-dialog.component.scss']
})
export class CreateActivityDialogComponent implements OnInit {

  public loading: boolean = false;
  public createActivityForm: FormGroup;
  public errors: ValidationErrors = { };

  public constructor(
    public readonly dialogRef: MatDialogRef<CreateActivityDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly activityService: ActivitiesService,
  ) { }

  public ngOnInit(): void {
    this.createActivityForm = this.fb.group({
      title: new FormControl('', { validators: [Validators.required, Validators.maxLength(255)] }),
      description: new FormControl('', { validators: [Validators.required] }),
      location: new FormControl('', { validators: [Validators.required] }),
      imageUrl: new FormControl('', { validators: [Validators.required, Validators.pattern(URL_REGEX)] }),
      organiser: new FormControl(''),
      startTime: new FormControl('', { validators: [Validators.required, checkIfStartTimeIsInPast] }),
      endTime: new FormControl('', { validators: [Validators.required] }),
      activeFrom: new FormControl('', { validators: [Validators.required, checkIfActiveFromIsInPast ] }),
      activeUntil: new FormControl(''),
      price: new FormControl('', { validators: Validators.min(1) }),
      maxAttendees: new FormControl('', { validators: Validators.min(1) }),
    },
      {
        validators: [
          checkIfEndTimeAfterStartTime,
          checkIfActiveFromBeforeStartTime,
          checkIfActiveUntilAfterActiveFrom,
        ]
      }
    );
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.loading = true;
      this.dialogRef.disableClose = true;
      const newActivity: CreateActivityDto = {
        title: this.createActivityForm.controls.title.value,
        description: this.createActivityForm.controls.description.value,
        location: this.createActivityForm.controls.location.value,
        imageUrl: this.createActivityForm.controls.imageUrl.value,
        organiser: this.createActivityForm.controls.organiser.value,
        startTime: Math.round(this.createActivityForm.controls.startTime.value / 1000),
        endTime: Math.round(this.createActivityForm.controls.endTime.value / 1000),
        activeFrom: Math.round(this.createActivityForm.controls.activeFrom.value / 1000),
        price: this.createActivityForm.controls.price.value ? this.createActivityForm.controls.price.value : null,
        maxAttendees: this.createActivityForm.controls.maxAttendees.value ? this.createActivityForm.controls.maxAttendees.value : null,
      };
      if (this.createActivityForm.controls.activeUntil.value) {
        newActivity.activeUntil = Math.round(this.createActivityForm.controls.activeUntil.value / 1000);
      }
      this.activityService.create(newActivity).subscribe({
        next: (activity: Activity) => {
          this.snackBar.open(this.contentService.get('create-activity.success'), null, { duration: TOAST_DURATION });
          this.dialogRef.disableClose = false;
          this.dialogRef.close(activity);
        },
        error: () => {
          this.snackBar.open(this.contentService.get('create-activity.error'), null, { duration: TOAST_DURATION });
          this.loading = false;
          this.dialogRef.disableClose = false;
        }
      });
    }
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.createActivityForm);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`activity.${fieldName}.error.${errorType}`);
    });
  }
}
