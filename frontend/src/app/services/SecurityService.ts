import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Security, TopSecurity } from '../types/Security';
import { Page } from '../types/Page';
import { catchWithMessage, pageParams, userIdParams } from '../shared/http.util';
import { SecurityTypeSlice } from '../components/charts/security-type-chart/security-type-chart';
import { SectorSlice } from '../components/charts/security-sector-chart/security-sector-chart';

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

  getSecuritiesPageForUser(
    userId: number,
    page: number,
    size: number,
    search: string,
  ): Observable<Page<Security>> {
    return this.http
      .get<Page<Security>>(`${this.URL}/u/${userId}/page`, { params: pageParams(page, size, search) })
      .pipe(catchWithMessage('Failed to load Securities.'));
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

  getSecurityTypeBreakdown(userId: number): Observable<SecurityTypeSlice[]> {
    return this.http
      .get<SecurityTypeSlice[]>(`${this.URL}/breakdown/type`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load security type breakdown for specified User.'));
  }

  getSectorBreakdown(userId: number): Observable<SectorSlice[]> {
    return this.http
      .get<SectorSlice[]>(`${this.URL}/breakdown/sector`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load sector breakdown for specified User.'));
  }
}
