import { Component, OnInit, ViewChild } from '@angular/core';
import { News } from './news.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NewsService } from './news.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../_modules/content/content.service';
import { ContentItem } from '../_modules/content/content-item.model';
import { TOAST_DURATION } from '../constants';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewsDialogComponent } from './create-news-dialog/create-news-dialog.component';
import { EditNewsDialogComponent } from './edit-news-dialog/edit-news-dialog.component';
import { DeleteNewsDialogComponent } from './delete-news-dialog/delete-news-dialog.component';
import { ShowNewsDialogComponent } from './show-news-dialog/show-news-dialog.component';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./news.content.json');

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;
  public displayedColumns: string[] = ['title', 'text', 'publishedAt', 'show', 'edit', 'delete'];
  public dataSource: MatTableDataSource<News>;
  public totalItemsCount: number;
  public readonly defaultPageSize: number = 10;

  public constructor(
    private readonly newsService: NewsService,
    private readonly snackBar: MatSnackBar,
    private readonly contentService: ContentService,
    private readonly dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.dataSource = new MatTableDataSource<News>();
    this.getNews(this.defaultPageSize, 0);
  }

  private getNews(limit: number, page: number): void {
    this.newsService.getAll(limit, page + 1).subscribe({
      next: res => {
        this.dataSource.data = res.items;
        this.totalItemsCount = res.totalItems;
      },
      error: () => this.snackBar.open(this.contentService.get('news.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public onLoadMore(): void {
    this.getNews(this.paginator.pageSize, this.paginator.pageIndex);
  }

  public showCreateNewsDialog(): void {
    this.dialog.open(CreateNewsDialogComponent, { width: '1000px' }).afterClosed().subscribe(created => {
      if (created) {
        this.ngOnInit();
      }
    });
  }

  public showShowNewsDialog(news: News): void {
    this.dialog.open(ShowNewsDialogComponent, { width: '1000px', data: news });
  }

  public showEditNewsDialog(news: News): void {
    this.dialog.open(EditNewsDialogComponent, { width: '1000px', data: news }).afterClosed().subscribe(updated => {
      if (updated) {
        this.ngOnInit();
      }
    });
  }

  public showDeleteNewsDialog(news: News): void {
    this.dialog.open(DeleteNewsDialogComponent, { width: '500px', data: news }).afterClosed().subscribe(deleted => {
      if (deleted) {
        this.ngOnInit();
      }
    });
  }
}
