import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Paged } from '../../app.model';
import { Question } from './question.model';

@Injectable({ providedIn: 'root' })
export class QuestionManagementService {

  public itemsTotal: number = undefined;

  public constructor(private readonly http: HttpClient) { }

  public getList(optionsParam?: { page?: number, limit?: number }): Observable<Question[]> {
    const options: { page?: number, limit?: number } = { page: 1, limit: 10 };
    Object.assign(options, optionsParam);
    return this.http.get<Paged<Question>>(`${environment.apiUrl}/activity-questions?page=${options.page}&limit=${options.limit}`)
      .pipe(map((res: Paged<Question>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public getAllForActivity(activityID: string): Observable<Question[]> {
    return this.http.get<Paged<Question>>(`${environment.apiUrl}/activity-questions?limit=1&activity=${activityID}`)
      .pipe(switchMap((res: Paged<Question>) => {
        const amount: number = res.totalItems;
        return this.http
          .get<Paged<Question>>(`${environment.apiUrl}/activity-questions?limit=${amount}&activity=${activityID}`)
          .pipe(map((r: Paged<Question>) => {
            this.itemsTotal = r.totalItems;
            return r.items;
          }));
      }));
  }

  public create(question: Question, activityId: string): Observable<Question> {
    return this.http.post<Question>(`${environment.apiUrl}/activity/${activityId}/questions`, question);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/activity-questions/${id}`);
  }

  public update(id: string, question: Question): Observable<Question> {
    return this.http.patch<Question>(`${environment.apiUrl}/activity-questions/${id}`, question);
  }
}
