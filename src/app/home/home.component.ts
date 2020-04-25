import { Component, ViewChild, AfterContentInit } from '@angular/core';
import { MatGridList } from '@angular/material/grid-list';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterContentInit {

  @ViewChild('grid') public grid: MatGridList;

  private readonly gridByBreakpoint: { xl: number, lg: number, md: number, sm: number, xs: number } = {
    xl: 3,
    lg: 3,
    md: 2,
    sm: 1,
    xs: 1
  };

  public constructor(private readonly observableMedia: MediaObserver) { }

  public ngAfterContentInit(): void {
    this.observableMedia.asObservable().subscribe((change: MediaChange[]) => {
      this.grid.cols = this.gridByBreakpoint[change[0].mqAlias];
    });
  }

}
