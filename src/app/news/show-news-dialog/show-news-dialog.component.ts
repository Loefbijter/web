import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { News } from '../news.model';

@Component({
  selector: 'app-show-news-dialog',
  templateUrl: './show-news-dialog.component.html',
  styles: ['p { white-space: pre-wrap;}']
})
export class ShowNewsDialogComponent {

  public constructor(
    @Inject(MAT_DIALOG_DATA) public news: News,
    public readonly dialogRef: MatDialogRef<ShowNewsDialogComponent>,
  ) { }
}
