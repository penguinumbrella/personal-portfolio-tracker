import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { InvestmentAccount } from '../types/InvestmentAccounts';
import { Page } from '../types/Page';
import { catchWithMessage, pageParams, userIdParams } from '../shared/http.util';
import { AccountTypeSlice } from '../components/charts/account-type-chart/account-type-chart';

/** HTTP client for creating, reading, updating, and deleting investment accounts, plus dashboard aggregates. */
@Injectable({ providedIn: 'root' })
export class InvestmentAccountService {
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseApiUrl}/investments`;

  /**
   * Fetches all investment accounts, optionally scoped to one user.
   *
   * @param userId the user's id to filter by, or omitted for every account
   * @returns the matching investment accounts
   */
  getAllInvestmentAccounts(userId?: number): Observable<InvestmentAccount[]> {
    let params = new HttpParams();

    if (userId != null) {
      params = params.set('userId', userId);
    }

    return this.http
      .get<InvestmentAccount[]>(this.URL, { params })
      .pipe(catchWithMessage('Failed to load InvestmentAccounts.'));
  }

  /**
   * Fetches a user's investment accounts, paginated and optionally filtered by nickname search,
   * for table views.
   *
   * @param userId the user's id
   * @param page the zero-based page number
   * @param size the page size
   * @param search a nickname search term
   * @returns the requested page of investment accounts
   */
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

  /**
   * Fetches a single investment account by id.
   *
   * @param id the investment account's id
   * @returns the matching investment account
   */
  getInvestmentAccountById(id: number): Observable<InvestmentAccount> {
    return this.http
      .get<InvestmentAccount>(`${this.URL}/${id}`)
      .pipe(catchWithMessage('Failed to load InvestmentAccounts.'));
  }

  /**
   * Creates a new investment account.
   *
   * @param investmentAccount the account to create
   * @returns the created account
   */
  createInvestmentAccount(investmentAccount: InvestmentAccount): Observable<InvestmentAccount> {
    return this.http
      .post<InvestmentAccount>(this.URL, investmentAccount)
      .pipe(catchWithMessage('Failed to create InvestmentAccount.'));
  }

  /**
   * Updates an existing investment account.
   *
   * @param id the investment account's id
   * @param investmentAccount the updated account data
   * @returns the updated account
   */
  updateInvestmentAccount(
    id: number,
    investmentAccount: InvestmentAccount,
  ): Observable<InvestmentAccount> {
    return this.http
      .put<InvestmentAccount>(`${this.URL}/${id}`, investmentAccount)
      .pipe(catchWithMessage('Failed to update InvestmentAccount.'));
  }

  /**
   * Deletes an investment account.
   *
   * @param id the investment account's id
   * @returns an observable that completes once the account has been deleted
   */
  deleteInvestmentAccount(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.URL}/${id}`)
      .pipe(catchWithMessage('Failed to delete InvestmentAccount.'));
  }

  /**
   * Fetches the backend-computed cost basis (sum of shares &times; cost per share) for one
   * account's holdings.
   *
   * @param accountId the investment account's id
   * @returns the account's total cost
   */
  getInvestmentAccountTotalCost(accountId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/${accountId}/total-cost`)
      .pipe(catchWithMessage('Failed to load total cost of InvestmentAccount.'));
  }

  /**
   * Fetches the count of investment accounts belonging to a user, for the dashboard summary.
   *
   * @param userId the user's id
   * @returns the user's total investment account count
   */
  getUserInvestmentAccountTotal(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.URL}/total`, { params: userIdParams(userId) })
      .pipe(catchWithMessage("Failed to load total count of a user's investment accounts."));
  }

  /**
   * Fetches a user's most recently created/updated accounts, for the dashboard's
   * recent-activity widget.
   *
   * @param userId the user's id
   * @returns the user's recent investment accounts
   */
  getRecentAccounts(userId: number): Observable<InvestmentAccount[]> {
    return this.http
      .get<InvestmentAccount[]>(`${this.URL}/recent`, { params: userIdParams(userId) })
      .pipe(catchWithMessage("Failed to load user's recent investment accounts."));
  }

  /**
   * Fetches a user's investment accounts grouped by account type, for the account-type chart.
   *
   * @param userId the user's id
   * @returns the user's account type breakdown
   */
  getAccountTypeBreakdown(userId: number): Observable<AccountTypeSlice[]> {
    return this.http
      .get<AccountTypeSlice[]>(`${this.URL}/breakdown/type`, { params: userIdParams(userId) })
      .pipe(catchWithMessage("Failed to load user's account type breakdown."));
  }
}
