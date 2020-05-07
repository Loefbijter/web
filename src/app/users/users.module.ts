import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { ContentModule } from '../_modules/content/content.module';
import { CommonModule } from '@angular/common';
import { FormErrorsModule } from '../_modules/form-errors/form-errors.module';
import { MaterialModule } from '../_helpers/material.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { EditUserDialogComponent } from './user-details/edit-user-dialog/edit-user-dialog.component';
import { DeleteUserDialogComponent } from './user-details/delete-user-dialog/delete-user-dialog.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: ':id', component: UserDetailsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormErrorsModule,
    MaterialModule,
    ContentModule,
  ],
  entryComponents: [
    CreateUserDialogComponent,
    EditUserDialogComponent,
    DeleteUserDialogComponent,
  ],
  declarations: [
    UsersComponent,
    UserDetailsComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    DeleteUserDialogComponent,
  ],
  providers: [
    UsersService
  ],
  exports: [],
})
export class UsersModule { }
