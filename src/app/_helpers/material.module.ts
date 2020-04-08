import { NgModule, Type } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const MODULES: Type<object>[] = [
  MatToolbarModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatProgressSpinnerModule
];

/**
 * This module acts as a holder for all the @angular/material assets,
 * so the clutter of imports is removed from the AppModule.
 */
@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class MaterialModule { }
