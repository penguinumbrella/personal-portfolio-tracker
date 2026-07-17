import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Holding } from '../types/Holding';
import { HoldingId } from '../types/HoldingId';
import { catchWithMessage, userIdParams } from '../shared/http.util';
import { PortfolioValuePoint } from '../components/charts/portfolio-value-chart/portfolio-value-chart';

/** HTTP client for creating, reading, updating, and deleting holdings, plus aggregate/history queries. */
@Injectable({ providedIn: 'root' })
export class HoldingService {
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseApiUrl}/holdings`;

  /**
   * Fetches all holdings belonging to one investment account.
   *
   * @param accountId the investment account's id
   * @returns the account's holdings
   */
  getAllHoldingsPerAccount(accountId: number): Observable<Holding[]> {
    return this.http
      .get<Holding[]>(`${this.URL}/a/${accountId}`)
      .pipe(catchWithMessage('Failed to load Holdings for specified Holding Account.'));
  }

  /**
   * Fetches all holdings of one security, across accounts.
   *
   * @param securityId the security's id
   * @returns the holdings of that security
   */
  getAllHoldingsPerSecurity(securityId: number): Observable<Holding[]> {
    return this.http
      .get<Holding[]>(`${this.URL}/s/${securityId}`)
      .pipe(catchWithMessage('Failed to load Holdings for specified Security.'));
  }

  /**
   * Creates a new holding.
   *
   * @param holding the holding to create
   * @returns the created holding
   */
  createHolding(holding: Holding): Observable<Holding> {
    return this.http
      .post<Holding>(this.URL, holding)
      .pipe(catchWithMessage('Failed to create Holding.'));
  }

  /**
   * Updates an existing holding. Holdings are keyed by the composite (accountId, securityId) id,
   * not a single numeric id.
   *
   * @param id the holding's composite id
   * @param holding the updated holding data
   * @returns the updated holding
   */
  updateHolding(id: HoldingId, holding: Holding): Observable<Holding> {
    return this.http
      .put<Holding>(`${this.URL}/a/${id.accountId}/s/${id.securityId}`, holding)
      .pipe(catchWithMessage('Failed to update Holding.'));
  }

  /**
   * Deletes a holding.
   *
   * @param id the holding's composite id
   * @returns an observable that completes once the holding has been deleted
   */
  deleteHolding(id: HoldingId): Observable<void> {
    return this.http
      .delete<void>(`${this.URL}/a/${id.accountId}/s/${id.securityId}`)
      .pipe(catchWithMessage('Failed to delete Holding.'));
  }

  /**
   * Fetches the backend-computed total number of holdings a user has, for dashboard summaries.
   *
   * @param userId the user's id
   * @returns the user's total holding count
   */
  getUserHoldingTotal(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/total`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load total user holdings.'));
  }

  /**
   * Fetches the backend-computed sum of (shares &times; cost per share) across all of a user's holdings.
   *
   * @param userId the user's id
   * @returns the user's total invested cost
   */
  totalInvestedCost(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/totalInvestedCost`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load total invested cost for specified User.'));
  }

  /**
   * Fetches a user's cumulative portfolio value over time, for the portfolio value chart.
   *
   * @param userId the user's id
   * @returns the user's portfolio value history, ordered by date
   */
  getPortfolioValueHistory(userId: number): Observable<PortfolioValuePoint[]> {
    return this.http
      .get<PortfolioValuePoint[]>(`${this.URL}/valueHistory`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load portfolio value history.'));
  }
}
