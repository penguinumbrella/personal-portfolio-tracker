import { Injectable, signal } from '@angular/core';
import { InvestmentAccount } from '../types/InvestmentAccounts';
import { TopSecurity } from '../types/Security';

//this service holds info used on dash and in the menu

@Injectable({ providedIn: 'root' })
export class DashboardStateService {
  recentAccounts = signal<InvestmentAccount[]>([]);
  topSecurities = signal<TopSecurity[]>([]);
}
