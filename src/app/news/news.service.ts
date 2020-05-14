import { Injectable } from '@angular/core';
import { News, PostNewsDto } from './news.model';
import { HttpClient } from '@angular/common/http';
import { Paged } from '../app.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  public constructor(
    private readonly http: HttpClient,
  ) { }

  public getAll(limit: number = 10, page: number = 0): Observable<Paged<News>> {
    return this.http.get<Paged<News>>(`${environment.apiUrl}/news?limit=${limit}&page=${page}`);
  }

  public create(news: PostNewsDto): Observable<News> {
    return this.http.post<News>(`${environment.apiUrl}/news`, news);
  }

  public update(id: string, news: PostNewsDto): Observable<News> {
    return this.http.patch<News>(`${environment.apiUrl}/news/${id}`, news);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/news/${id}`);
  }
}
