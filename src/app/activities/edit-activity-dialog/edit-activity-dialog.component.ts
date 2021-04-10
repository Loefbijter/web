import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, ValidationErrors, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { FormErrorsService } from '../../_modules/form-errors/form-errors.service';
import { ActivitiesService } from '../activities.service';
import { URL_REGEX, TOAST_DURATION } from '../../constants';
import { Activity, ActivityImage, UpdateActivityDto } from '../activity.model';
import * as moment from 'moment';
import {
  checkIfEndTimeAfterStartTime,
  checkIfActiveFromBeforeStartTime,
  checkIfActiveUntilAfterActiveFrom,
  checkIfActiveFromIsInPast,
  checkIfStartTimeIsInPast,
  checkIfActiveUntilBeforeEndTime,
} from '../activities.validators';
import { ImagesService } from '../images.service';

@Component({
  selector: 'app-edit-activity-dialog',
  templateUrl: './edit-activity-dialog.component.html',
  styleUrls: ['./edit-activity-dialog.component.scss']
})
export class EditActivityDialogComponent implements OnInit {

  public loading: boolean = false;
  public editActivityForm: FormGroup;
  public errors: ValidationErrors = { };
  public images: ActivityImage[] = [];

  public constructor(
    @Inject(MAT_DIALOG_DATA) public activity: Activity,
    public readonly dialogRef: MatDialogRef<EditActivityDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly contentService: ContentService,
    private readonly formErrorsService: FormErrorsService,
    private readonly activityService: ActivitiesService,
    private readonly imagesService: ImagesService
  ) { }

  public ngOnInit(): void {

    this.imagesService.getImages().subscribe({
      next: images => {
        this.images = images['images'];
      }
    });

    this.editActivityForm = this.fb.group({
      title: new FormControl(this.activity.title, { validators: [Validators.required, Validators.maxLength(255)] }),
      description: new FormControl(this.activity.description, { validators: [Validators.required] }),
      location: new FormControl(this.activity.location, { validators: [Validators.required] }),
      imageUrl: new FormControl(this.activity.imageUrl, { validators: [Validators.required, Validators.pattern(URL_REGEX)] }),
      organiser: new FormControl(this.activity.organiser),
      startTime: new FormControl(moment(this.activity.startTime * 1000), { validators: [Validators.required, checkIfStartTimeIsInPast] }),
      endTime: new FormControl(moment(this.activity.endTime * 1000), { validators: [Validators.required] }),
      activeFrom: new FormControl(moment(this.activity.activeFrom * 1000),
        { validators: [Validators.required] }),
      activeUntil: new FormControl(this.activity.activeUntil ? moment(this.activity.activeUntil * 1000) : ''),
      price: new FormControl(this.activity.price, { validators: Validators.min(0) }),
      maxAttendees: new FormControl(this.activity.maxAttendees, { validators: Validators.min(1) }),
    },
      {
        validators: [
          checkIfEndTimeAfterStartTime,
          checkIfActiveFromBeforeStartTime,
          checkIfActiveUntilAfterActiveFrom,
          checkIfActiveUntilBeforeEndTime,
        ]
      }
    );
    if (this.activity.activeFrom <= Date.now() / 1000) {
      this.editActivityForm.controls['activeFrom'].disable();
      this.editActivityForm.controls['price'].disable();
    }
  }

  public onSubmit(): void {
    if (this.isValid()) {
      this.loading = true;
      this.dialogRef.disableClose = true;
      const controls: { [key: string]: AbstractControl; } = this.editActivityForm.controls;
      const updatedActivity: UpdateActivityDto = { };
      if (controls.title.value !== this.activity.title) updatedActivity.title = controls.title.value;
      if (controls.description.value !== this.activity.description) updatedActivity.description = controls.description.value;
      if (controls.location.value !== this.activity.location) updatedActivity.location = controls.location.value;
      if (controls.imageUrl.value !== this.activity.imageUrl) updatedActivity.imageUrl = controls.imageUrl.value;
      if (controls.organiser.value !== this.activity.organiser) updatedActivity.organiser = controls.organiser.value;
      if (controls.price.value !== this.activity.price) updatedActivity.price = controls.price.value;
      if (controls.maxAttendees.value !== this.activity.maxAttendees) updatedActivity.maxAttendees = controls.maxAttendees.value;
      const newStartTime: number = Math.round(controls.startTime.value / 1000);
      const newEndTime: number = Math.round(controls.endTime.value / 1000);
      const newActiveFrom: number = Math.round(controls.activeFrom.value / 1000);
      const newActiveUntil: number = controls.activeUntil.value ? Math.round(controls.activeUntil.value / 1000) : null;
      if (newStartTime !== this.activity.startTime) updatedActivity.startTime = newStartTime;
      if (newEndTime !== this.activity.endTime) updatedActivity.endTime = newEndTime;
      if (newActiveFrom !== this.activity.activeFrom) updatedActivity.activeFrom = newActiveFrom;
      if (newActiveUntil !== this.activity.activeUntil) updatedActivity.activeUntil = newActiveUntil;

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
    this.errors[fieldName] = Object.keys(errors).map(errorType => {
      return this.contentService.get(`activity.${fieldName}.error.${errorType}`);
    });
  }
}
