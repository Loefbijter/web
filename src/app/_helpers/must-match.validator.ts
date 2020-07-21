import { FormGroup, AbstractControl } from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string): (form: FormGroup) => void {
  return (form: FormGroup): void => {
    const control: AbstractControl = form.controls[controlName];
    const matchingControl: AbstractControl = form.controls[matchingControlName];

    if (matchingControl.errors && ! matchingControl.errors.mustMatch) {
      // Return immediately if another error was found on the matching control
      return;
    }

    // Set mustMatch error on matching control if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
