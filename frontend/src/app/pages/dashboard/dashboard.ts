import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MetricCard } from '../../components/metric-card/metric-card';
import { DashboardTable, TableColumn } from '../../components/dashboard-table/dashboard-table';
import { SecurityTypeChart, SecurityTypeSlice } from '../../components/charts/security-type-chart/security-type-chart';
import { AccountTypeChart, AccountTypeSlice } from '../../components/charts/account-type-chart/account-type-chart';
import { SecuritySectorChart, SectorSlice } from '../../components/charts/security-sector-chart/security-sector-chart';
import { PortfolioValueChart, PortfolioValuePoint } from '../../components/charts/portfolio-value-chart/portfolio-value-chart';
import { BreakdownCarousel } from '../../components/charts/breakdown-carousel/breakdown-carousel';

import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { HoldingService } from '../../services/HoldingService';
import { SecurityService } from '../../services/SecurityService';
import { AuthService } from '../../services/AuthService';
import { DashboardStateService } from '../../services/DashboardStateService';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { TopSecurity } from '../../types/Security';
import { SecurityType } from '../../types/SecurityType';
import { InvestmentType } from '../../types/InvestmentType';
import { Sector } from '../../types/Sector';
import { Holding } from '../../types/Holding';

@Component({
  selector: 'app-dashboard',
  imports: [MetricCard, DashboardTable, SecurityTypeChart, AccountTypeChart, SecuritySectorChart, PortfolioValueChart, BreakdownCarousel],
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
  securityTypeBreakdown = signal<SecurityTypeSlice[]>([]);
  accountTypeBreakdown = signal<AccountTypeSlice[]>([]);
  securitySectorBreakdown = signal<SectorSlice[]>([]);
  portfolioValueHistory = signal<PortfolioValuePoint[]>([]);

  breakdownTitles = ['Securities by Type', 'Accounts by Type', 'Securities by Sector'];

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
        this.loadSecurityBreakdowns(user.id!);
        this.loadAccountTypeBreakdown(user.id!);
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

  loadSecurityBreakdowns(userId: number): void {
    this.securityService.getSecurityTypeBreakdown(userId).subscribe({
      next: (breakdown) => {
        const counts = new Map(breakdown.map((slice) => [slice.type, slice.count]));
        this.securityTypeBreakdown.set(
          Object.values(SecurityType).map((type) => ({ type, count: counts.get(type) ?? 0 })),
        );
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.securityService.getSectorBreakdown(userId).subscribe({
      next: (breakdown) => {
        const counts = new Map(breakdown.map((slice) => [slice.sector, slice.count]));
        this.securitySectorBreakdown.set(
          Object.values(Sector).map((sector) => ({ sector, count: counts.get(sector) ?? 0 })),
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadAccountTypeBreakdown(userId: number): void {
    this.investmentAccountService.getAccountTypeBreakdown(userId).subscribe({
      next: (breakdown) => {
        const counts = new Map(breakdown.map((slice) => [slice.type, slice.count]));
        this.accountTypeBreakdown.set(
          Object.values(InvestmentType).map((type) => ({ type, count: counts.get(type) ?? 0 })),
        );
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.investmentAccountService.getAllInvestmentAccounts(userId).subscribe({
      next: (accounts) => this.loadPortfolioValueHistory(accounts),
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadPortfolioValueHistory(accounts: InvestmentAccount[]): void {
    if (accounts.length === 0) {
      this.portfolioValueHistory.set([]);
      return;
    }

    forkJoin(accounts.map((account) => this.holdingService.getAllHoldingsPerAccount(account.id!))).subscribe({
      next: (holdingsPerAccount) => {
        this.portfolioValueHistory.set(this.buildCumulativeValueSeries(holdingsPerAccount.flat()));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // No historical market prices are tracked, so "value over time" is the running
  // total of cost basis (shares * costPerShare) as of each purchase date.
  private buildCumulativeValueSeries(holdings: Holding[]): PortfolioValuePoint[] {
    const costByDate = new Map<string, number>();
    for (const holding of holdings) {
      const dateKey = new Date(holding.purchaseDate).toISOString().slice(0, 10);
      costByDate.set(dateKey, (costByDate.get(dateKey) ?? 0) + holding.shares * holding.costPerShare);
    }

    let runningTotal = 0;
    return Array.from(costByDate.keys())
      .sort()
      .map((date) => {
        runningTotal += costByDate.get(date)!;
        return { date, value: runningTotal };
      });
  }
}
