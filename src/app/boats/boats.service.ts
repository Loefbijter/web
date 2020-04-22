import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Boat, CreateBoatDto } from './boats.model';
import { Observable } from 'rxjs';
import { Paged } from '../app.model';

@Injectable({ providedIn: 'root' })
export class BoatsService {

  public itemsTotal: number = undefined;

  public constructor(private readonly http: HttpClient) { }

  public getAll(page: number = 0, limit: number = 10): Observable<Boat[]> {
    return this.http.get<Paged<Boat>>(`${environment.apiUrl}/boats?page=${page}&limit=${limit}`)
      .pipe(map((res: Paged<Boat>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public getOne(id: string): Observable<Boat> {
    return this.http.get<Boat>(`${environment.apiUrl}/boats/${id}`);
  }

  public create(boat: CreateBoatDto): Observable<Boat> {
    return this.http.post<Boat>(`${environment.apiUrl}/boats`, boat);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/boats/${id}`);
  }

  public update(id: string, boat: CreateBoatDto): Observable<Boat> {
    return this.http.patch<Boat>(`${environment.apiUrl}/boats/${id}`, boat);
  }
}
