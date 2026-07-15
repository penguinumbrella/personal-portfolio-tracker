import { Component, computed, inject, signal } from '@angular/core';
import { MetricCard } from '../../components/metric-card/metric-card';
import { DashboardTable, TableColumn } from '../../components/dashboard-table/dashboard-table';

import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { HoldingService } from '../../services/HoldingService';
import { SecurityService } from '../../services/SecurityService';
import { AuthService } from '../../services/AuthService';
import { DashboardStateService } from '../../services/DashboardStateService';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { TopSecurity } from '../../types/Security';

@Component({
  selector: 'app-dashboard',
  imports: [MetricCard, DashboardTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private authService = inject(AuthService);
  private investmentAccountService = inject(InvestmentAccountService);
  private holdingService = inject(HoldingService);
  private securityService = inject(SecurityService);
  private dashboardStateService = inject(DashboardStateService);

  recentAccounts = computed<InvestmentAccount[]>(() => this.dashboardStateService.recentAccounts());
  topSecurities = computed<TopSecurity[]>(() => this.dashboardStateService.topSecurities());
  totalAccounts = signal<number>(0);
  totalSecurities = signal<number>(0);
  totalHoldings = signal<number>(0);
  totalInvestedCost = signal<number>(0);

  accountColumns: TableColumn[] = [
    { header: 'Name', field: 'nickname' },
    { header: 'Date', field: 'dateOpened' },
    { header: 'Value', field: 'value' },
  ];

  securityColumns: TableColumn[] = [
    {
      header: 'Name',
      field: 'name',
    },
    {
      header: 'Value',
      field: 'value',
    },
  ];

  ngOnInit(): void {
    // Always re-verify with the server rather than trusting a cached value, so switching
    // accounts never leaves the dashboard showing the previous session's data.
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.loadTotals(user.id!);
        this.loadRecentAccounts(user.id!);
        this.loadTopSecurities(user.id!);
      },
      error: (err) => console.error('Failed to resolve current user:', err),
    });
  }

  loadTotals(userId: number): void {
    this.investmentAccountService.getUserInvestmentAccountTotal(userId).subscribe({
      next: (data) => {
        this.totalAccounts.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.securityService.getUserSecurityTotal(userId).subscribe({
      next: (data) => {
        this.totalSecurities.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.holdingService.getUserHoldingTotal(userId).subscribe({
      next: (data) => {
        this.totalHoldings.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.holdingService.totalInvestedCost(userId).subscribe({
      next: (data) => {
        this.totalInvestedCost.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadRecentAccounts(userId: number): void {
    this.investmentAccountService.getRecentAccounts(userId).subscribe({
      next: (data) => {
        // add total cost to each account
        data.forEach((account) => {
          this.investmentAccountService.getInvestmentAccountTotalCost(account.id!).subscribe({
            next: (cost) => {
              // if an account has no holdings
              if (cost === null) {
                cost = 0;
              }
              account.value = cost;
              // update the signal each time a cost comes back
              this.dashboardStateService.recentAccounts.update((current) =>
                current.map((a) => (a.id === account.id ? { ...a, value: cost } : a)),
              );
            },
            error: (err) => console.error(err),
          });
        });
        this.dashboardStateService.recentAccounts.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadTopSecurities(userId: number): void {
    this.securityService.getTopSecurities(userId).subscribe({
      next: (data) => {
        this.dashboardStateService.topSecurities.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
