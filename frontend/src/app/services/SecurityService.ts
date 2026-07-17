import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Security, TopSecurity } from '../types/Security';
import { Page } from '../types/Page';
import { catchWithMessage, pageParams, userIdParams } from '../shared/http.util';
import { SecurityTypeSlice } from '../components/charts/security-type-chart/security-type-chart';
import { SectorSlice } from '../components/charts/security-sector-chart/security-sector-chart';

/** HTTP client for creating, reading, updating, and deleting securities, plus aggregate/breakdown queries. */
@Injectable({ providedIn: 'root' })
export class SecurityService {
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseApiUrl}/securities`;

  /**
   * Fetches a single security by id.
   *
   * @param id the security's id
   * @returns the matching security
   */
  getSecurityById(id: number): Observable<Security> {
    return this.http
      .get<Security>(`${this.URL}/${id}`)
      .pipe(catchWithMessage('Failed to load Security for specified ID.'));
  }

  /**
   * Fetches the unpaginated list of all securities a user holds, e.g. for populating
   * select/lookup lists.
   *
   * @param userId the user's id
   * @returns the user's securities
   */
  getAllSecuritiesByUser(userId?: number): Observable<Security[]> {
    return this.http
      .get<Security[]>(`${this.URL}/u/${userId}`)
      .pipe(catchWithMessage('Failed to load Securities for specified User.'));
  }

  /**
   * Fetches a user's securities, paginated and optionally filtered by name search, for table views.
   *
   * @param userId the user's id
   * @param page the zero-based page number
   * @param size the page size
   * @param search a name search term
   * @returns the requested page of securities
   */
  getSecuritiesPageForUser(
    userId: number,
    page: number,
    size: number,
    search: string,
  ): Observable<Page<Security>> {
    return this.http
      .get<Page<Security>>(`${this.URL}/u/${userId}/page`, {
        params: pageParams(page, size, search),
      })
      .pipe(catchWithMessage('Failed to load Securities.'));
  }

  /**
   * Creates a new security.
   *
   * @param security the security to create
   * @returns the created security
   */
  createSecurity(security: Security): Observable<Security> {
    return this.http
      .post<Security>(this.URL, security)
      .pipe(catchWithMessage('Failed to create Security.'));
  }

  /**
   * Updates an existing security.
   *
   * @param id the security's id
   * @param security the updated security data
   * @returns the updated security
   */
  updateSecurity(id: number, security: Security): Observable<Security> {
    return this.http
      .put<Security>(`${this.URL}/${id}`, security)
      .pipe(catchWithMessage('Failed to update Security.'));
  }

  /**
   * Deletes a security.
   *
   * @param id the security's id
   * @returns an observable that completes once the security has been deleted
   */
  deleteSecurity(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.URL}/${id}`)
      .pipe(catchWithMessage('Failed to delete Security.'));
  }

  /**
   * Fetches the total number of securities a user has.
   *
   * @param userId the user's id
   * @returns the user's total security count
   */
  getUserSecurityTotal(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/total`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load total user securities.'));
  }

  /**
   * Fetches a user's backend-ranked top securities by value, for dashboard widgets.
   *
   * @param userId the user's id
   * @returns the user's top securities
   */
  getTopSecurities(userId: number): Observable<TopSecurity[]> {
    return this.http
      .get<TopSecurity[]>(`${this.URL}/top`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load top Securities for specified User.'));
  }

  /**
   * Fetches a user's securities grouped by security type, for the security-type chart.
   *
   * @param userId the user's id
   * @returns the user's security type breakdown
   */
  getSecurityTypeBreakdown(userId: number): Observable<SecurityTypeSlice[]> {
    return this.http
      .get<SecurityTypeSlice[]>(`${this.URL}/breakdown/type`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load security type breakdown for specified User.'));
  }

  /**
   * Fetches a user's securities grouped by sector, for the sector chart.
   *
   * @param userId the user's id
   * @returns the user's sector breakdown
   */
  getSectorBreakdown(userId: number): Observable<SectorSlice[]> {
    return this.http
      .get<SectorSlice[]>(`${this.URL}/breakdown/sector`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load sector breakdown for specified User.'));
  }
}
