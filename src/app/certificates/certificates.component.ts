import { Component, OnInit } from '@angular/core';
import { CertificatesService } from './certificates.service';
import { Observable } from 'rxjs';
import { Certificate } from './certificates.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateCertificateDialogComponent } from './create-certificate-dialog/create-certificate-dialog.component';
import { EditCertificateDialogComponent } from './edit-certificate-dialog/edit-certificate-dialog.component';
import { DeleteCertificateDialogComponent } from './delete-certificate-dialog/delete-certificate-dialog.component';
import { ContentItem } from '../_modules/content/content-item.model';
import { ContentService } from '../_modules/content/content.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_DURATION } from '../constants';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./certificates.content.json');

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {

  public certificates: Observable<Certificate[]>;
  public readonly displayedColumns: string[] = ['name', 'showInSkippersList', 'edit', 'delete'];

  public constructor(
    private readonly contentService: ContentService,
    private readonly certificatesService: CertificatesService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {
    this.contentService.addContentItems(content);
  }

  public ngOnInit(): void {
    this.certificates = this.certificatesService.getAllComplete();
    this.certificates.subscribe({
      error: () => {
        this.snackBar.open(this.contentService.get('certificates.error.loading'), null, { duration: TOAST_DURATION });
      }
    });
  }

  public showCreateCertificateDialog(): void {
    this.dialog.open(CreateCertificateDialogComponent, { width: '500px' }).afterClosed().subscribe({
      next: (newCertificate) => {
        if (newCertificate) {
          // Reload the data
          this.ngOnInit();
        }
      }
    });
  }

  public showEditCertificateDialog(certificate: Certificate): void {
    this.dialog.open(EditCertificateDialogComponent, { width: '500px', data: certificate }).afterClosed().subscribe({
      next: (editedCertificate) => {
        if (editedCertificate) {
          // Reload the data
          this.ngOnInit();
        }
      }
    });
  }

  public showDeleteCertificateDialog(certificate: Certificate): void {
    this.dialog.open(DeleteCertificateDialogComponent, { width: '500px', data: certificate }).afterClosed().subscribe({
      next: (deleted) => {
        if (deleted) {
          // Reload the data
          this.ngOnInit();
        }
      }
    });
  }
}
