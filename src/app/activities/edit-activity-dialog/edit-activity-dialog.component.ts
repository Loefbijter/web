import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, ValidationErrors, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { FormErrorsService } from '../../_modules/form-errors/form-errors.service';
import { ActivitiesService } from '../activities.service';
import { URL_REGEX, TOAST_DURATION } from '../../constants';
import { Activity, UpdateActivityDto } from '../activity.model';
import * as moment from 'moment';
import {
  checkIfEndTimeAfterStartTime,
  checkIfActiveFromBeforeStartTime,
  checkIfActiveUntilAfterActiveFrom,
  checkIfActiveFromIsInPast,
  checkIfStartTimeIsInPast
} from '../activities.validators';

@Component({
  selector: 'app-edit-activity-dialog',
  templateUrl: './edit-activity-dialog.component.html',
  styleUrls: ['./edit-activity-dialog.component.scss']
})
export class EditActivityDialogComponent implements OnInit {

  public loading: boolean = false;
  public editActivityForm: FormGroup;
  public errors: ValidationErrors = { };

  public constructor(
    @Inject(MAT_DIALOG_DATA) public activity: Activity,
    public readonly dialogRef: MatDialogRef<EditActivityDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly activityService: ActivitiesService,
  ) { }

  public ngOnInit(): void {
    this.editActivityForm = this.fb.group({
      title: new FormControl(this.activity.title, { validators: [Validators.required, Validators.maxLength(255)] }),
      description: new FormControl(this.activity.description, { validators: [Validators.required] }),
      location: new FormControl(this.activity.location, { validators: [Validators.required] }),
      imageUrl: new FormControl(this.activity.imageUrl, { validators: [Validators.required, Validators.pattern(URL_REGEX)] }),
      organiser: new FormControl(this.activity.organiser),
      startTime: new FormControl(moment(this.activity.startTime * 1000), { validators: [Validators.required, checkIfStartTimeIsInPast] }),
      endTime: new FormControl(moment(this.activity.endTime * 1000), { validators: [Validators.required] }),
      activeFrom: new FormControl(moment(this.activity.activeFrom * 1000),
        { validators: [Validators.required, checkIfActiveFromIsInPast] }),
      activeUntil: new FormControl(this.activity.activeUntil ? moment(this.activity.activeUntil * 1000) : ''),
      price: new FormControl(this.activity.price, { validators: Validators.min(1) }),
      maxAttendees: new FormControl(this.activity.maxAttendees, { validators: Validators.min(1) }),
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
      const updatedActivity: UpdateActivityDto = {
        title: this.editActivityForm.controls.title.value,
        description: this.editActivityForm.controls.description.value,
        location: this.editActivityForm.controls.location.value,
        imageUrl: this.editActivityForm.controls.imageUrl.value,
        organiser: this.editActivityForm.controls.organiser.value,
        startTime: Math.round(this.editActivityForm.controls.startTime.value / 1000),
        endTime: Math.round(this.editActivityForm.controls.endTime.value / 1000),
        activeFrom: Math.round(this.editActivityForm.controls.activeFrom.value / 1000),
        price: this.editActivityForm.controls.price.value,
        maxAttendees: this.editActivityForm.controls.maxAttendees.value,
      };
      if (this.editActivityForm.controls.activeUntil.value || this.activity.activeUntil) {
        updatedActivity.activeUntil = Math.round(this.editActivityForm.controls.activeUntil.value / 1000) || null;
      }
      this.activityService.update(this.activity.id, updatedActivity).subscribe({
        next: (activity: Activity) => {
          this.snackBar.open(this.contentService.get('edit-activity.success'), null, { duration: TOAST_DURATION });
          this.dialogRef.disableClose = false;
          this.dialogRef.close(activity);
        },
        error: () => {
          this.snackBar.open(this.contentService.get('edit-activity.error'), null, { duration: TOAST_DURATION });
          this.loading = false;
          this.dialogRef.disableClose = false;
        }
      });
    }
  }

  private isValid(): boolean {
    return this.formErrorsService.verify(this.editActivityForm);
  }

  public updateErrors(fieldName: string, errors: ValidationErrors): void {
    console.log(this.editActivityForm.controls.activeUntil.value);
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`activity.${fieldName}.error.${errorType}`);
    });
  }
}
