import { Component, signal } from '@angular/core';
import { MetricCard } from '../../components/metric-card/metric-card';
import { DashboardTable } from '../../components/dashboard-table/dashboard-table';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { HoldingService } from '../../services/HoldingService';
import { SecurityService } from '../../services/SecurityService';
import { Security } from '../../types/Security';
import { UserService } from '../../services/UserService';

@Component({
  selector: 'app-dashboard',
  imports: [MetricCard, DashboardTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  recentAccounts = signal<InvestmentAccount[]>([]);
  recentSecurities = signal<Security[]>([]);
  totalAccounts = signal<number>(0);
  totalSecurities = signal<number>(0);
  totalHoldings = signal<number>(0);
  totalInvestedCost = signal<number>(0);
  userId = signal<number | null>(null);

  constructor(
    private investmentAccountService: InvestmentAccountService,
    private holdingService: HoldingService,
    private securityService: SecurityService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadTotals();
    this.loadRecentAccounts();
    this.loadRecentSecurities();
  }

  loadUser() {
    this.userService.getCurrentUserId().subscribe({
      next: (id) => {
        this.userId.set(id);
      },
    });
  }

  loadTotals(): void {
    this.investmentAccountService.getUserInvestmentAccountTotal(this.userId()!).subscribe({
      next: (data) => {
        this.totalAccounts.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.securityService.getUserSecurityTotal(this.userId()!).subscribe({
      next: (data) => {
        this.totalSecurities.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.holdingService.getUserHoldingTotal(this.userId()!).subscribe({
      next: (data) => {
        this.totalHoldings.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.holdingService.totalInvestedCost(this.userId()!).subscribe({
      next: (data) => {
        this.totalInvestedCost.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadRecentAccounts(): void {
    this.investmentAccountService.getRecentAccounts(this.userId()!).subscribe({
      next: (data) => {
        this.recentAccounts.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadRecentSecurities(): void {
    this.securityService.getRecentSecurities(this.userId()!).subscribe({
      next: (data) => {
        this.recentSecurities.set(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
