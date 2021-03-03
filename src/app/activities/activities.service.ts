import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Activity, CreateActivityDto, UpdateActivityDto, Registration, Question } from './activity.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, flatMap } from 'rxjs/operators';
import { Paged } from '../app.model';

@Injectable({ providedIn: 'root' })
export class ActivitiesService {

  public itemsTotal: number = undefined;

  public constructor(private readonly http: HttpClient) { }

  public getAll(limit: number = 10, page: number = 0): Observable<Activity[]> {
    return this.http.get<Paged<Activity>>(`${environment.apiUrl}/activities` +
        `?page=${page}` +
        `&limit=${limit}` +
        '&showPast=true' +
        '&showFuture=true' +
        '&orderBy=startTime' +
        '&sortOrder=DESC')
      .pipe(map((res: Paged<Activity>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public getOne(id: string): Observable<Activity> {
    return this.http.get<Activity>(`${environment.apiUrl}/activities/${id}`);
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

  public getRegistrations(id: string, limit: number = 10, page: number = 0): Observable<Registration[]> {
    return this.http.get<Paged<Registration>>(`${environment.apiUrl}/activity-registrations?activity=${id}&page=${page}&limit=${limit}&loadAnswers=true`).pipe(
      map((res: Paged<Registration>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      })
    );
  }

  public getRegistration(id: string): Observable<Registration> {
    return this.http.get<Registration>(`${environment.apiUrl}/activity-registrations/${id}`);
  }

  public deleteRegistration(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/activity-registrations/${id}`);
  }

  public getQuestions(id: string): Observable<Question[]> {
    return this.http.get<Paged<Question>>(`${environment.apiUrl}/activity-questions?activity=${id}&limit=100`).pipe(
      map((res: Paged<Question>) => {
        return res.items;
      })
    );
  }

}
