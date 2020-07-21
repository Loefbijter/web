import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss']
})
export class FormErrorsComponent implements OnInit, OnDestroy {

  @Input() public targetFormControl: FormControl;
  @Input() public messages: string[];
  @Output() public errorChanges: EventEmitter<ValidationErrors> = new EventEmitter<ValidationErrors>();

  private readonly subscription: Subscription = new Subscription();

  public ngOnInit(): void {
    this.handleSyncValidation();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private handleSyncValidation(): void {
    this.subscription.add(
      this.targetFormControl.valueChanges.subscribe(() =>
        setTimeout(() => this.update())
      )
    );
  }

  private update(): void {
    if (this.targetFormControl.invalid) {
      this.errorChanges.emit(this.targetFormControl.errors);
    }
  }

  public get errorsArePresent(): boolean {
    return (
      this.targetFormControl &&
      this.targetFormControl.invalid &&
      this.targetFormControl.dirty &&
      this.targetFormControl.touched
    );
  }
}
