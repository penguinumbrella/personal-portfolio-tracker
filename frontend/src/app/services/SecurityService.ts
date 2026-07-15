import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Security, TopSecurity } from '../types/Security';
import { catchWithMessage, userIdParams } from '../shared/http.util';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseApiUrl}/securities`;

  getSecurityById(id: number): Observable<Security> {
    return this.http
      .get<Security>(`${this.URL}/${id}`)
      .pipe(catchWithMessage('Failed to load Security for specified ID.'));
  }

  getAllSecuritiesByUser(userId?: number): Observable<Security[]> {
    return this.http
      .get<Security[]>(`${this.URL}/u/${userId}`)
      .pipe(catchWithMessage('Failed to load Securities for specified User.'));
  }

  createSecurity(security: Security): Observable<Security> {
    return this.http
      .post<Security>(this.URL, security)
      .pipe(catchWithMessage('Failed to create Security.'));
  }

  updateSecurity(id: number, security: Security): Observable<Security> {
    return this.http
      .put<Security>(`${this.URL}/${id}`, security)
      .pipe(catchWithMessage('Failed to update Security.'));
  }

  deleteSecurity(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.URL}/${id}`)
      .pipe(catchWithMessage('Failed to delete Security.'));
  }

  getUserSecurityTotal(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/total`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load total user securities.'));
  }

  getTopSecurities(userId: number): Observable<TopSecurity[]> {
    console.log(`Fetching top securities for userId: ${userId}`);
    return this.http
      .get<TopSecurity[]>(`${this.URL}/top`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load top Securities for specified User.'));
  }
}
