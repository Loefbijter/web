import { FormGroup, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export function checkIfStartTimeIsInPast(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value != '' && control.value <= (moment().unix() * 1000)) {
    return { inThePast: true };
  }
  return null;
}

export function checkIfActiveFromIsInPast(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value != '' && control.value <= (moment().unix() * 1000)) {
    return { inThePast: true };
  }
  return null;
}

export const checkIfEndTimeAfterStartTime: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const startTime: AbstractControl = control.get('startTime');
  const endTime: AbstractControl = control.get('endTime');
  return startTime.value != '' && endTime.value != '' && endTime.value <= startTime.value ? { endTimeAfterBeginTime: true } : null;
};

export const checkIfActiveFromBeforeStartTime: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const startTime: AbstractControl = control.get('startTime');
  const activeFrom: AbstractControl = control.get('activeFrom');
  return startTime.value != '' && activeFrom.value != '' &&
    activeFrom.value >= startTime.value ? { activeFromBeforeStartTime: true } : null;
};

export const checkIfActiveUntilAfterActiveFrom: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const activeUntil: AbstractControl = control.get('activeUntil');
  const activeFrom: AbstractControl = control.get('activeFrom');
  if (!activeUntil.value) {
    return null;
  }
  return activeUntil.value != '' && activeFrom.value >= activeUntil.value ? { activeUntilBeforeActiveFrom: true } : null;
};
