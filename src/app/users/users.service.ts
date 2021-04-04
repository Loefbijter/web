import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserDto } from './users.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Paged } from '../app.model';

@Injectable()
export class UsersService {

  public itemsTotal: number;

  public constructor(private readonly http: HttpClient) { }

  public getAll(optionsParam?: { page?: number, limit?: number, filter?: string}): Observable<User[]> {
    const options: { page?: number, limit?: number, filter? } = { page: 1, limit: 10, filter: '' };
    Object.assign(options, optionsParam);
    return this.http.get<Paged<User>>(`${environment.apiUrl}/users?page=${options.page}&limit=${options.limit}&name-contains=${options.filter}`)
      .pipe(map((res: Paged<User>) => {
        this.itemsTotal = res.totalItems;
        return res.items;
      }));
  }

  public getOne(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  public create(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, user);
  }

  public update(id: string, user: CreateUserDto): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/users/${id}`, user);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${id}`);
  }

  public linkCertificate(userId: string, certificateId: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/users/${userId}/certificates`, { certificateId });
  }

  public unlinkCertificate(userId: string, certificateId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${userId}/certificates/${certificateId}`);
  }
}
