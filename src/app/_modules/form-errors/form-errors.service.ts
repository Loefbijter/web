import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

@Injectable()
export class FormErrorsService {

  public verify(formGroup: AbstractControl): boolean {
    this.markAsDoneRecursively(formGroup);
    return formGroup.valid;
  }

  private markAsDoneRecursively(form: AbstractControl): void {
    if (form.disabled) {
      return;
    }
    form.markAsDirty({ onlySelf: true });
    form.markAsTouched({ onlySelf: true });
    form.updateValueAndValidity({ onlySelf: true });
    if (form instanceof FormArray) {
      form.controls.forEach(control => this.markAsDoneRecursively(control));
    }
    if (form instanceof FormGroup) {
      Object.keys(form.controls).forEach(key => this.markAsDoneRecursively(form.controls[key]));
    }
  }
}
