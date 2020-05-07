import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UsersService } from './users.service';
import { MatTableDataSource } from '@angular/material/table';
import { User } from './users.model';
import { MatPaginator } from '@angular/material/paginator';
import { ContentItem } from '../_modules/content/content-item.model';
import { ContentService } from '../_modules/content/content.service';
import { tap } from 'rxjs/operators';
import { TOAST_DURATION } from '../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';

// tslint:disable-next-line: no-var-requires
const content: ContentItem = require('./users.content.json');

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

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
    this.dataSource = new MatTableDataSource<User>();
    this.dataSource.paginator = this.paginator;
    this.contentService.addContentItems(content);
    this.getUsers(this.defaultPageSize);
  }

  public ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.onLoadMore())).subscribe();
  }

  private getUsers(limit: number): void {
    this.usersService.getAll({ limit }).subscribe({
      next: users => {
        this.dataSource.data = users;
        this.totalItemsCount = this.usersService.itemsTotal;
      },
      error: () => this.snackBar.open(this.contentService.get('users.error.loading'), null, { duration: TOAST_DURATION })
    });
  }

  public onLoadMore(): void {
    if (
      this.dataSource.data.length != this.usersService.itemsTotal &&
      (this.paginator.pageIndex * this.paginator.pageSize) >= this.dataSource.data.length
    ) {
      this.usersService.getAll({ page: this.paginator.pageIndex + 1, limit: this.paginator.pageSize }).subscribe({
        next: users => {
          const newUsers: User[] = this.dataSource.data.slice();
          newUsers.push(...users);
          this.dataSource.data = newUsers;
          this.totalItemsCount = this.usersService.itemsTotal;
        },
        error: () => this.snackBar.open(this.contentService.get('users.error.loading'), null, { duration: TOAST_DURATION })
      });
    }
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
