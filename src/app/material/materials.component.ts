import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Material } from './materials.model';
import { CreateMaterialDialogComponent } from './create-dialog/create-material-dialog.component';
import { ContentService } from '../_modules/content/content.service';
import { MaterialsService } from './materials.service';
import { TOAST_DURATION } from '../constants';
import { ContentItem } from '../_modules/content/content-item.model';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./materials.content.json');

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {

  public materials: Material[] = [];

  public constructor(
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly materialService: MaterialsService
  ) {
  }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.getMaterial();
  }

  private getMaterial(): void {
    this.materialService.getAll().subscribe({
      next: materials => this.materials = materials,
      error: () => this.snackBar.open(this.contentService.get('material.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public showCreateMaterialForm(): void {
    this.dialog.open(CreateMaterialDialogComponent, { width: '500px' }).afterClosed().subscribe({
      next: (material: Material) => {
        if (material) {
          this.materials.push(material);
        }
      }
    });
  }

}
