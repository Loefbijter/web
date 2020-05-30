import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../users.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { TOAST_DURATION } from '../../constants';
import { AuthService } from '../../_services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { ContentItem } from '../../_modules/content/content-item.model';
import { CertificatesService } from '../../certificates/certificates.service';
import { Certificate } from '../../certificates/certificates.model';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./user-details.content.json');

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  public user: User;
  public certificates$: Observable<Certificate[]>;
  public userCertificates$: Observable<Certificate[]>;

  public certificatesControl: FormControl;
  public saving: boolean = false;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly usersService: UsersService,
    private readonly certificatesService: CertificatesService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {
    this.contentService.addContentItems(content);
  }

  public ngOnInit(): void {
    const id: string = this.route.snapshot.paramMap.get('id');
    this.usersService.getOne(id).subscribe({
      next: user => {
        this.user = user;
        this.getCertificates();
      },
      error: () => {
        this.snackBar.open(this.contentService.get('user-details.not-found'), null, { duration: TOAST_DURATION });
        this.router.navigate(['users']);
      }
    });
  }

  private getCertificates(): void {
    this.certificates$ = this.certificatesService.getAllComplete();
    this.userCertificates$ = this.certificatesService.getCertificatesFromUser(this.user.id);
    this.userCertificates$.subscribe({
      next: c => this.certificatesControl = new FormControl(c)
    });
  }

  public onResetPasswordClick(): void {
    this.authService.resetPassword(this.user.email).subscribe({
      next: () => this.snackBar.open(this.contentService.get('user-details.reset-password.success'), null, { duration: TOAST_DURATION }),
      error: () => this.snackBar.open(this.contentService.get('user-details.reset-password.error'), null, { duration: TOAST_DURATION })
    });
  }

  public onEditClick(): void {
    this.dialog.open(EditUserDialogComponent, { data: this.user, width: '500px' }).afterClosed().subscribe({
      next: (updated) => {
        if (updated) {
          this.ngOnInit();
        }
      }
    });
  }

  public onDeleteClick(): void {
    this.dialog.open(DeleteUserDialogComponent, { data: this.user, width: '500px' }).afterClosed().subscribe({
      next: (deleted) => {
        if (deleted) {
          this.router.navigate(['users']);
        }
      }
    });
  }

  public onSelectionChange(change: MatSelectionListChange): void {
    this.saving = true;
    const cert: Certificate = change.option.value;
    if (change.option.selected) {
      // link the user and certificate
      this.usersService.linkCertificate(this.user.id, cert.id).subscribe({
        next: () => this.saving = false,
        error: () => this.snackBar.open(this.contentService.get('user-details.certificates.error'), null, { duration: TOAST_DURATION })
      });
    } else {
      // unlink the user and certificate
      this.usersService.unlinkCertificate(this.user.id, cert.id).subscribe({
        next: () => this.saving = false,
        error: () => this.snackBar.open(this.contentService.get('user-details.certificates.error'), null, { duration: TOAST_DURATION })
      });
    }
  }

  public compareCertificates(o1: Certificate, o2: Certificate): boolean {
    return o1 && o2 && o1.id == o2.id;
  }
}
