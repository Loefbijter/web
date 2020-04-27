import { Injectable } from '@angular/core';
import { Certificate, CreateCertificateDto } from './certificates.model';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Paged } from '../app.model';

@Injectable({ providedIn: 'root' })
export class CertificatesService {

  public constructor(private readonly http: HttpClient) { }

  public getAll(): Observable<Certificate[]> {
    return this.http.get<Paged<Certificate>>(`${environment.apiUrl}/certificates`)
      .pipe(map(res => res.items));
  }

  public getAllComplete(): Observable<Certificate[]> {
    return this.http.get<Paged<Certificate>>(`${environment.apiUrl}/certificates`).pipe(
      switchMap(res => {
        return this.http.get<Paged<Certificate>>(`${environment.apiUrl}/certificates?limit=${res.totalItems}`)
          .pipe(map(r => r.items));
      })
    );
  }

  public create(certificate: CreateCertificateDto): Observable<Certificate> {
    return this.http.post<Certificate>(`${environment.apiUrl}/certificates`, certificate);
  }

  public update(id: string, certificate: CreateCertificateDto): Observable<Certificate> {
    return this.http.put<Certificate>(`${environment.apiUrl}/certificates/${id}`, certificate);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/certificates/${id}`);
  }
}
