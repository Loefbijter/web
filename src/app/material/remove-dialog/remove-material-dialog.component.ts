import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { TOAST_DURATION } from '../../constants';
import { Material } from '../materials.model';
import { MaterialsService } from '../materials.service';

@Component({
  selector: 'app-remove-material-dialog',
  templateUrl: './remove-material-dialog.component.html',
  styleUrls: ['./remove-material-dialog.component.scss']
})
export class RemoveMaterialDialogComponent {

  public constructor(
    @Inject(MAT_DIALOG_DATA) public material: Material,
    public readonly dialogRef: MatDialogRef<RemoveMaterialDialogComponent>,
    private readonly materialService: MaterialsService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService
  ) { }

  public onConfirm(): void {
    this.materialService.remove(this.material.id).subscribe({
      next: () => {
        this.snackBar.open(this.contentService.get('material.delete.success'), null, { duration: TOAST_DURATION });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open(this.contentService.get('material.delete.error'), null, { duration: TOAST_DURATION });
        this.dialogRef.close();
      }
    });
  }

}
