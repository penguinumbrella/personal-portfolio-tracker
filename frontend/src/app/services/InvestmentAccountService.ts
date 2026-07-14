import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { InvestmentAccount } from '../types/InvestmentAccounts';
import { catchWithMessage, userIdParams } from '../shared/http.util';
import { Holding } from '../types/Holding';
import { HoldingService } from './HoldingService';

@Injectable({ providedIn: 'root' })
export class InvestmentAccountService {
  /**
   * SERVICES
   *      - handle the business logic of your application
   *      - primarilly used for logic that will be reused across components
   *
   *      - biggest example: HTTP requests
   *          - one central location for all your related requests
   */

  private http = inject(HttpClient);

  private readonly URL = `${environment.baseApiUrl}/investments`;

  getAllInvestmentAccounts(userId?: number): Observable<InvestmentAccount[]> {
    let params = new HttpParams();

    // set the rating param if a value was given
    if (userId != null) {
      params = params.set('userId', userId);
    }

    return this.http
      .get<InvestmentAccount[]>(this.URL, { params })
      .pipe(catchWithMessage('Failed to load InvestmentAccounts.'));
  }

  getInvestmentAccountById(id: number): Observable<InvestmentAccount> {
    return this.http
      .get<InvestmentAccount>(`${this.URL}/${id}`)
      .pipe(catchWithMessage('Failed to load InvestmentAccounts.'));
  }

  createInvestmentAccount(investmentAccount: InvestmentAccount): Observable<InvestmentAccount> {
    return this.http
      .post<InvestmentAccount>(this.URL, investmentAccount)
      .pipe(catchWithMessage('Failed to create InvestmentAccount.'));
  }

  updateInvestmentAccount(
    id: number,
    investmentAccount: InvestmentAccount,
  ): Observable<InvestmentAccount> {
    return this.http
      .put<InvestmentAccount>(`${this.URL}/${id}`, investmentAccount)
      .pipe(catchWithMessage('Failed to update InvestmentAccount.'));
  }

  deleteInvestmentAccount(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.URL}/${id}`)
      .pipe(catchWithMessage('Failed to delete InvestmentAccount.'));
  }

  getUserInvestmentAccountTotal(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/total`, { params: userIdParams(userId) })
      .pipe(catchWithMessage("Failed to load total count of a user's investment accounts."));
  }

  getRecentAccounts(userId: number): Observable<InvestmentAccount[]> {
    return this.http
      .get<InvestmentAccount[]>(`${this.URL}/recent`, { params: userIdParams(userId) })
      .pipe(catchWithMessage("Failed to load user's recent investment accounts."));
  }
}
