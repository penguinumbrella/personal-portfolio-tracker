import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { InvestmentAccount } from '../types/InvestmentAccounts';
import { Page } from '../types/Page';
import { catchWithMessage, pageParams, userIdParams } from '../shared/http.util';
import { AccountTypeSlice } from '../components/charts/account-type-chart/account-type-chart';

@Injectable({ providedIn: 'root' })
export class InvestmentAccountService {
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseApiUrl}/investments`;

  // crud classics

  getAllInvestmentAccounts(userId?: number): Observable<InvestmentAccount[]> {
    let params = new HttpParams();

    // userId is optional here. only scope the request to a user if one was given.
    if (userId != null) {
      params = params.set('userId', userId);
    }

    return this.http
      .get<InvestmentAccount[]>(this.URL, { params })
      .pipe(catchWithMessage('Failed to load InvestmentAccounts.'));
  }

  // Paginated + searchable listing scoped to a user, for table views.
  getAccountsPage(
    userId: number,
    page: number,
    size: number,
    search: string,
  ): Observable<Page<InvestmentAccount>> {
    const params = pageParams(page, size, search).set('userId', userId);
    return this.http
      .get<Page<InvestmentAccount>>(`${this.URL}/page`, { params })
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

  // getting helpers for backend calculations

  // Backend-computed cost basis (sum of shares * costPerShare) for one account's holdings.
  getInvestmentAccountTotalCost(accountId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/${accountId}/total-cost`)
      .pipe(catchWithMessage('Failed to load total cost of InvestmentAccount.'));
  }

  // Count of investment accounts belonging to a user (dashboard summary).
  getUserInvestmentAccountTotal(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/total`, { params: userIdParams(userId) })
      .pipe(catchWithMessage("Failed to load total count of a user's investment accounts."));
  }

  // Most recently created/updated accounts for a user, for the dashboard's recent-activity widget.
  getRecentAccounts(userId: number): Observable<InvestmentAccount[]> {
    return this.http
      .get<InvestmentAccount[]>(`${this.URL}/recent`, { params: userIdParams(userId) })
      .pipe(catchWithMessage("Failed to load user's recent investment accounts."));
  }

  // Aggregated breakdown by account type, for the account-type chart.
  getAccountTypeBreakdown(userId: number): Observable<AccountTypeSlice[]> {
    return this.http
      .get<AccountTypeSlice[]>(`${this.URL}/breakdown/type`, { params: userIdParams(userId) })
      .pipe(catchWithMessage("Failed to load user's account type breakdown."));
  }
}
