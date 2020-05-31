import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paged } from '../app.model';
import { environment } from '../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Material, CreateMaterialDto } from './materials.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {

  public itemsTotal: number = undefined;

  public constructor(private readonly http: HttpClient) { }

  public getList(optionsParam?: { page?: number, limit?: number }): Observable<Material[]> {
    const options: { page?: number, limit?: number } = { page: 1, limit: 10 };
    Object.assign(options, optionsParam);
    return this.http
      .get<Paged<Material>>(`${environment.apiUrl}/materials?page=${options.page}&limit=${options.limit}`)
      .pipe(map((res: Paged<Material>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public getOne(materialId: string): Observable<Material> {
    return this.http
      .get<Material>(`${environment.apiUrl}/materials/${materialId}`)
      .pipe(map((res: Material) => {
        return res;
      }));
  }

  public getAll(): Observable<Material[]> {
    return this.http.get<Paged<Material>>(`${environment.apiUrl}/materials?limit=1`)
      .pipe(switchMap((res: Paged<Material>) => {
        const amount: number = res.totalItems;
        return this.http
          .get<Paged<Material>>(`${environment.apiUrl}/materials?limit=${amount}`)
          .pipe(map((r: Paged<Material>) => {
            this.itemsTotal = r.totalItems;
            return r.items;
          }));
      }));
  }

  public create(material: CreateMaterialDto): Observable<Material> {
    return this.http.post<Material>(`${environment.apiUrl}/materials`, material);
  }

  public update(id: string, material: CreateMaterialDto): Observable<Material> {
    return this.http.patch<Material>(`${environment.apiUrl}/materials/${id}`, material);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/materials/${id}`);
  }
}
