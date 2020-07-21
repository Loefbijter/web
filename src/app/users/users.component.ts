import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TOAST_DURATION } from '../constants';
import { ContentItem } from '../_modules/content/content-item.model';
import { ContentService } from '../_modules/content/content.service';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { User } from './users.model';
import { UsersService } from './users.service';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./users.content.json');

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) private readonly paginator: MatPaginator;
  public displayedColumns: string[] = ['name', 'email', 'role'];
  public dataSource: MatTableDataSource<User>;
  public totalItemsCount: number;
  public readonly defaultPageSize: number = 10;

  public constructor(
    private readonly usersService: UsersService,
    private readonly contentService: ContentService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.contentService.addContentItems(content);
    this.dataSource = new MatTableDataSource<User>();
    this.getUsers(0, this.defaultPageSize);
  }

  private getUsers(page: number, limit: number): void {
    this.usersService.getAll({ limit, page: page + 1 }).subscribe({
      next: users => {
        this.dataSource.data = users;
        this.totalItemsCount = this.usersService.itemsTotal;
      },
      error: () => this.snackBar.open(this.contentService.get('users.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public onLoadMore(): void {
    this.getUsers(this.paginator.pageIndex, this.paginator.pageSize);
  }

  public onCreateUserClick(): void {
    this.dialog.open(CreateUserDialogComponent, { width: '500px' }).afterClosed().subscribe({
      next: (created) => {
        if (created) {
          this.ngOnInit();
        }
      }
    });
  }
}
