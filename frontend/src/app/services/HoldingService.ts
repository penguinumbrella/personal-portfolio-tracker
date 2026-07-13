import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Holding } from '../types/Holding';
import { HoldingId } from '../types/HoldingId';
import { catchWithMessage, userIdParams } from '../shared/http.util';

@Injectable({ providedIn: 'root' })
export class HoldingService {
  private readonly URL = `${environment.baseApiUrl}/holdings`;

  constructor(private http: HttpClient) {}

  getAllHoldingsPerAccount(accountId: number): Observable<Holding[]> {
    return this.http
      .get<Holding[]>(`${this.URL}/a/${accountId}`)
      .pipe(catchWithMessage('Failed to load Holdings for specified Holding Account.'));
  }

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

  getUserHoldingTotal(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/total`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load total user holdings.'));
  }

  totalInvestedCost(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/totalInvestedCost`, { params: userIdParams(userId) })
      .pipe(catchWithMessage('Failed to load total invested cost for specified User.'));
  }
}
