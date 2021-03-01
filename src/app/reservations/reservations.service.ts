import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation, AcceptanceDto, Order } from './reservations.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paged } from '../app.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReservationsService {

  public itemsTotal: number = undefined;
  public openItemsTotal: number = undefined;

  public constructor(private readonly http: HttpClient) { }

  public getAll(optionsParam?: { page?: number, limit?: number, order?: Order }): Observable<Reservation[]> {
    const options: { page?: number, limit?: number, order: Order } = { page: 1, limit: 10, order: Order.DESC };
    Object.assign(options, optionsParam);
    return this.http
      .get<Paged<Reservation>>(`${environment.apiUrl}/boat-reservations?page=${options.page}&limit=${options.limit}&order=${options.order}`)
      .pipe(map((res: Paged<Reservation>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public getAllOpen(optionsParam?: { page?: number, limit?: number, order?: Order }): Observable<Reservation[]> {
    const options: { page?: number, limit?: number, order?: Order } = { page: 1, limit: 10, order: Order.ASC };
    Object.assign(options, optionsParam);
    return this.http
      .get<Paged<Reservation>>(
        `${environment.apiUrl}/boat-reservations?page=${options.page}&limit=${options.limit}&order=${options.order}&notReviewed=true`
      )
      .pipe(map((res: Paged<Reservation>) => {
        this.openItemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public getAllFinished(id: string, optionsParam?: { page?: number, limit?: number, order?: Order }): Observable<Reservation[]> {
    const options: { page?: number, limit?: number, order?: Order } = { page: 1, limit: 10, order: Order.DESC };
    Object.assign(options, optionsParam);
    return this.http
      .get<Paged<Reservation>>(
        `${environment.apiUrl}/boat-reservations?page=${options.page}&limit=${options.limit}&order=${options.order}&boatId=${id}&finished=true`
      )
      .pipe(map((res: Paged<Reservation>) => {
        this.openItemsTotal = res.totalItems;
        return res.items;
      }));
  }


  public getOne(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${environment.apiUrl}/boats-reservations/${id}`);
  }

  public setAcceptanceOfReservation(id: string, boat: AcceptanceDto): Observable<Reservation> {
    return this.http.post<Reservation>(`${environment.apiUrl}/boat-reservations/${id}/reviews`, boat);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/boat-reservations/${id}`);
  }
}
