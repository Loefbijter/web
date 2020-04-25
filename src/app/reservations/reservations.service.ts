import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation, AcceptanceDto } from './reservations.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paged } from '../app.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReservationsService {

  public itemsTotal: number = undefined;
  public openItemsTotal: number = undefined;

  public constructor(private readonly http: HttpClient) { }

  public getAll(optionsParam?: { page?: number, limit?: number }): Observable<Reservation[]> {
    const options: { page?: number, limit?: number } = { page: 1, limit: 10 };
    Object.assign(options, optionsParam);
    return this.http.get<Paged<Reservation>>(`${environment.apiUrl}/boat-reservations?page=${options.page}&limit=${options.limit}`)
      .pipe(map((res: Paged<Reservation>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public getAllOpen(optionsParam?: { page?: number, limit?: number }): Observable<Reservation[]> {
    const options: { page?: number, limit?: number } = { page: 1, limit: 10 };
    Object.assign(options, optionsParam);
    return this.http
      .get<Paged<Reservation>>(`${environment.apiUrl}/boat-reservations?page=${options.page}&limit=${options.limit}&notReviewed=true`)
      .pipe(map((res: Paged<Reservation>) => {
        this.openItemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public getOne(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${environment.apiUrl}/boats-reservations/${id}`);
  }

  public setAcceptanceOfReservation(id: string, boat: AcceptanceDto): Observable<Reservation> {
    return this.http.put<Reservation>(`${environment.apiUrl}/boat-reservations/acceptance/${id}`, boat);
  }
}
