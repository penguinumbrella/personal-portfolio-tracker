import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Holding } from '../types/Holding';
import { HoldingId } from '../types/HoldingId';
import { catchWithMessage, userIdParams } from '../shared/http.util';

@Injectable({ providedIn: 'root' })
export class HoldingService {
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseApiUrl}/holdings`;

  // All holdings belonging to a given investment account.
  getAllHoldingsPerAccount(accountId: number): Observable<Holding[]> {
    return this.http
      .get<Holding[]>(`${this.URL}/a/${accountId}`)
      .pipe(catchWithMessage('Failed to load Holdings for specified Holding Account.'));
  }

  // All holdings (across accounts) for a given security.
  getAllHoldingsPerSecurity(securityId: number): Observable<Holding[]> {
    return this.http
      .get<Holding[]>(`${this.URL}/s/${securityId}`)
      .pipe(catchWithMessage('Failed to load Holdings for specified Security.'));
  }

  createHolding(holding: Holding): Observable<Holding> {
    return this.http
      .post<Holding>(this.URL, holding)
      .pipe(catchWithMessage('Failed to create Holding.'));
  }

  // Holdings are keyed by the composite (accountId, securityId) id, not a single numeric id.
  updateHolding(id: HoldingId, holding: Holding): Observable<Holding> {
    return this.http
      .put<Holding>(`${this.URL}/a/${id.accountId}/s/${id.securityId}`, holding)
      .pipe(catchWithMessage('Failed to update Holding.'));
  }

  deleteHolding(id: HoldingId): Observable<void> {
    return this.http
      .delete<void>(`${this.URL}/a/${id.accountId}/s/${id.securityId}`)
      .pipe(catchWithMessage('Failed to delete Holding.'));
  }

  // Backend-computed total number/value of holdings for a user (used on dashboard summaries).
  getUserHoldingTotal(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/total`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load total user holdings.'));
  }

  // Backend-computed sum of (shares * costPerShare) across all of a user's holdings.
  totalInvestedCost(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/totalInvestedCost`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load total invested cost for specified User.'));
  }
}
