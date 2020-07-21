import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paged } from '../app.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CreateMaterialDto, MaterialReservation, MaterialReservationStatus } from '../material/materials.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialReservationsService {

  public itemsTotal: number = undefined;

  public constructor(private readonly http: HttpClient) {
  }

  public getList(optionsParam?: { page?: number, limit?: number}): Observable<MaterialReservation[]> {
    const options: { page?: number, limit?: number } = { page: 1, limit: 10 };
    Object.assign(options, optionsParam);
    return this.http
      .get<Paged<MaterialReservation>>(
        `${environment.apiUrl}/material-reservations?page=${options.page}&limit=${options.limit}`
      )
      .pipe(map((res: Paged<MaterialReservation>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public getListForMaterial(materialID: string, optionsParam?: { page?: number, limit?: number }): Observable<MaterialReservation[]> {
    const options: { page?: number, limit?: number } = { page: 1, limit: 10 };
    Object.assign(options, optionsParam);
    return this.http
      .get<Paged<MaterialReservation>>(
        `${environment.apiUrl}/material-reservations?page=${options.page}&limit=${options.limit}&materialId=${materialID}`
      )
      .pipe(map((res: Paged<MaterialReservation>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public getListForStatus(
    status: MaterialReservationStatus,
    optionsParam?: { page?: number, limit?: number }
  ): Observable<MaterialReservation[]> {
    const options: { page?: number, limit?: number } = { page: 1, limit: 10 };
    Object.assign(options, optionsParam);
    return this.http
      .get<Paged<MaterialReservation>>(
        `${environment.apiUrl}/material-reservations?page=${options.page}&limit=${options.limit}&status=${status}`
      )
      .pipe(map((res: Paged<MaterialReservation>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public updateStatus(id: string, materialStatus: MaterialReservationStatus): Observable<MaterialReservation> {
    return this.http.patch<MaterialReservation>(`${environment.apiUrl}/material-reservations/${id}`, { status: materialStatus });
  }

  public update(id: string, materialStatus: CreateMaterialDto): Observable<MaterialReservation> {
    return this.http.patch<MaterialReservation>(`${environment.apiUrl}/material-reservations/${id}`, materialStatus);
  }

}
