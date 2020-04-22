import { Injectable } from '@angular/core';
import { Certificate } from './certificates.model';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Paged } from '../app.model';

@Injectable({ providedIn: 'root' })
export class CertificatesService {

  public constructor(private readonly http: HttpClient) { }

  public getAllComplete(): Observable<Certificate[]> {
    return this.http.get<Paged<Certificate>>(`${environment.apiUrl}/certificates`).pipe(
      switchMap(res => {
        return this.http.get<Paged<Certificate>>(`${environment.apiUrl}/certificates?limit=${res.totalItems}`)
          .pipe(map(r => r.items));
      })
    );
  }
}
