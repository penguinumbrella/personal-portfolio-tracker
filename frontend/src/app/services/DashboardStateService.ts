import { Injectable, signal } from '@angular/core';
import { InvestmentAccount } from '../types/InvestmentAccounts';
import { TopSecurity } from '../types/Security';

/**
 * Holds dashboard data shared across the dashboard widgets and the menu, so both read the same
 * cached data instead of re-fetching.
 */
@Injectable({ providedIn: 'root' })
export class DashboardStateService {
  /** The signed-in user's most recently opened investment accounts. */
  recentAccounts = signal<InvestmentAccount[]>([]);

  /** The signed-in user's top securities by value. */
  topSecurities = signal<TopSecurity[]>([]);
}
