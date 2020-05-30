import { Component, Inject } from '@angular/core';
import { News } from '../news.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewsService } from '../news.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../_modules/content/content.service';
import { TOAST_DURATION } from '../../constants';

@Component({
  selector: 'app-delete-news-dialog',
  templateUrl: './delete-news-dialog.component.html',
  styles: ['.actions { display: flex; justify-content: flex-end; } .actions>* { margin: 0 5px; }']
})
export class DeleteNewsDialogComponent {

  public constructor(
    @Inject(MAT_DIALOG_DATA) public news: News,
    public readonly dialogRef: MatDialogRef<DeleteNewsDialogComponent>,
    private readonly newsService: NewsService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService,
  ) { }

  public onConfirm(): void {
    this.newsService.remove(this.news.id).subscribe({
      next: () => {
        this.snackBar.open(this.contentService.get('delete-news.success'), null, { duration: TOAST_DURATION });
        // Signal back that the news article was successfully deleted
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open(this.contentService.get('delete-news.error'), null, { duration: TOAST_DURATION });
        this.dialogRef.close();
      }
    });
  }
}
