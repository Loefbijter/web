import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ActivitiesService } from '../activities.service';
import { Activity, Registration } from '../activity.model';

@Component({
  selector: 'app-entries-dialog',
  templateUrl: './entries-dialog.component.html',
  styleUrls: ['./entries-dialog.component.scss']
})
export class EntriesDialogComponent implements OnInit {

  public registrations$: Observable<Registration[]>;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public activity: Activity,
    public readonly dialogRef: MatDialogRef<EntriesDialogComponent>,
    private readonly activityService: ActivitiesService,
  ) { }

  public ngOnInit(): void {
    this.registrations$ = this.activityService.getRegistrations(this.activity.id);
  }
}
