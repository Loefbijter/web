import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Tokens, RefreshResponse, UserRole, DecodedToken } from '../_helpers/auth.model';
import * as jwtDecode from 'jwt-decode';
import { SetPasswordDto } from '../set-password/set-password.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly currentUserSubject: BehaviorSubject<Tokens>;
  public currentUser: Observable<Tokens>;

  public constructor(private readonly http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Tokens>(this.getTokensFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public refresh(): Observable<boolean> {
    // by copying the refreshtoken to the bearertoken field, we achieve the desired result
    // which is sending the refreshtoken along with the refresh api call
    let tempTokens: Tokens = this.getTokensFromStorage();
    tempTokens = { bearerToken: tempTokens.refreshToken, refreshToken: tempTokens.refreshToken };
    this.storeTokens(tempTokens);

    return this.http.post<RefreshResponse>(`${environment.apiUrl}/auth/refresh`, null, { headers: { 'x-refreshing': '1' } })
      .pipe(map(res => {
        const tokens: Tokens = this.getTokensFromStorage();
        tokens.bearerToken = res.bearerToken;
        this.storeTokens(tokens);
        return true;
      }));
  }

  public get currentUserValue(): Tokens {
    return this.currentUserSubject.value;
  }

  public login(email: string, password: string): Observable<boolean> {
    return this.http.post<Tokens>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(map(tokens => {
        // check if the user has role >= COMMITTEE
        const role: number = jwtDecode(tokens.bearerToken)['role'];
        if (role && role <= UserRole.COMMITTEE) {
          // store user details and jwt token to keep user logged in
          this.storeTokens(tokens);
          return true;
        } else {
          // the user does not have the required role, do not log in
          throw new Error('User role not sufficient');
        }
      }));
  }

  public logout(): void {
    localStorage.removeItem('authTokens');
    this.currentUserSubject.next(null);
  }

  public setPassword(dto: SetPasswordDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/set-password`, dto);
  }

  public resetPassword(userEmail: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/reset-password`, { email: userEmail });
  }

  private storeTokens(tokens: Tokens): void {
    localStorage.setItem('authTokens', JSON.stringify(tokens));
    this.currentUserSubject.next(this.getTokensFromStorage());
  }

  private getTokensFromStorage(): Tokens {
    const tokens: Tokens = JSON.parse(localStorage.getItem('authTokens'));
    return tokens || null;
  }

  public hasMinRole(role: number): boolean {
    const token: DecodedToken = jwtDecode(this.getTokensFromStorage().bearerToken);
    return token.role <= role;
  }

}
