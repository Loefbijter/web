import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Certificate } from '../certificates.model';
import { CertificatesService } from '../certificates.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_DURATION } from '../../constants';
import { ContentService } from '../../_modules/content/content.service';

@Component({
  selector: 'app-delete-certificate-dialog',
  templateUrl: './delete-certificate-dialog.component.html',
  styles: ['.actions { display: flex; justify-content: flex-end; } .actions>* { margin: 0 5px; }']
})
export class DeleteCertificateDialogComponent {

  public constructor(
    @Inject(MAT_DIALOG_DATA) public certificate: Certificate,
    public readonly dialogRef: MatDialogRef<DeleteCertificateDialogComponent>,
    private readonly certificatesService: CertificatesService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService
  ) { }

  public onConfirm(): void {
    this.certificatesService.remove(this.certificate.id).subscribe({
      next: () => {
        this.snackBar.open(this.contentService.get('delete-certificate.success'), null, { duration: TOAST_DURATION });
        // Signal back that the certificate was deleted successfully
        this.dialogRef.close(true);
      },
      error: err => {
        if (err === 'Unprocessable Entity') {
          this.snackBar.open(this.contentService.get('delete-certificate.error.in-use'), null, { duration: TOAST_DURATION });
          this.dialogRef.close();
        }
      }
    });
  }
}
