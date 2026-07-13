import { Component, inject, signal } from '@angular/core';
import { MetricCard } from '../../components/metric-card/metric-card';
import { DashboardTable } from '../../components/dashboard-table/dashboard-table';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { HoldingService } from '../../services/HoldingService';
import { SecurityService } from '../../services/SecurityService';
import { Security } from '../../types/Security';
import { AuthService } from '../../services/AuthService';

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

  recentAccounts = signal<InvestmentAccount[]>([]);
  recentSecurities = signal<Security[]>([]);
  totalAccounts = signal<number>(0);
  totalSecurities = signal<number>(0);
  totalHoldings = signal<number>(0);
  totalInvestedCost = signal<number>(0);

  ngOnInit(): void {
    // Always re-verify with the server rather than trusting a cached value, so switching
    // accounts never leaves the dashboard showing the previous session's data.
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.loadTotals(user.id!);
        this.loadRecentAccounts(user.id!);
        this.loadRecentSecurities(user.id!);
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
      }
    })

    this.securityService.getUserSecurityTotal(userId).subscribe({
      next: (data) => {
        this.totalSecurities.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.holdingService.getUserHoldingTotal(userId).subscribe({
      next: (data) => {
        this.totalHoldings.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.holdingService.totalInvestedCost(userId).subscribe({
      next: (data) => {
        this.totalInvestedCost.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  loadRecentAccounts(userId: number): void {
    this.investmentAccountService.getRecentAccounts(userId).subscribe({
      next: (data) => {
        this.recentAccounts.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  loadRecentSecurities(userId: number): void {
    this.securityService.getRecentSecurities(userId).subscribe({
      next: (data) => {
        this.recentSecurities.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
