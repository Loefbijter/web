import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Damage, UpdateDamageDto } from './damage.model';
import { Paged } from '../app.model';

@Injectable({ providedIn: 'root' })
export class DamageService {

  public itemsTotal: number = undefined;

  public constructor(private readonly http: HttpClient) { }

  public getAll(id: string, page: number = 0, limit: number = 10): Observable<Damage[]> {
    return this.http.get<Paged<Damage>>(`${environment.apiUrl}/boats/${id}/damages?page=${page}&limit=${limit}`)
      .pipe(map((res: Paged<Damage>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public update(id: string, damage: UpdateDamageDto): Observable<Damage> {
    return this.http.patch<Damage>(`${environment.apiUrl}/damages/${id}`, damage);
  }
}
