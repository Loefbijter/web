import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Activity, CreateActivityDto, UpdateActivityDto, Registration } from './activity.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, flatMap } from 'rxjs/operators';
import { Paged } from '../app.model';

@Injectable({ providedIn: 'root' })
export class ActivitiesService {

  public itemsTotal: number = undefined;

  public constructor(private readonly http: HttpClient) { }

  public getAll(limit: number = 10, page: number = 0): Observable<Activity[]> {
    return this.http.get<Paged<Activity>>(`${environment.apiUrl}/activities?page=${page}&limit=${limit}`)
      .pipe(map((res: Paged<Activity>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public create(activity: CreateActivityDto): Observable<Activity> {
    return this.http.post<Activity>(`${environment.apiUrl}/activities`, activity);
  }

  public update(id: string, activity: UpdateActivityDto): Observable<Activity> {
    return this.http.patch<Activity>(`${environment.apiUrl}/activities/${id}`, activity);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/activities/${id}`);
  }

  public getRegistrations(id: string): Observable<Registration[]> {
    return this.http.get<Paged<Registration>>(`${environment.apiUrl}/activity-registrations?activity=${id}&limit=0`)
      .pipe(flatMap((res: Paged<Registration>) => {
        return this.http.get<Paged<Registration>>(`${environment.apiUrl}/activity-registrations?activity=${id}&limit=${res.totalItems}`)
          .pipe(map((resTotal: Paged<Registration>) => {
            return resTotal.items;
          }));
      }));
  }

  public getRegistration(id: string): Observable<Registration> {
    return this.http.get<Registration>(`${environment.apiUrl}/activity-registrations/${id}`);
  }
}
