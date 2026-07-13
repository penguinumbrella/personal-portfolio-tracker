import { Component, signal } from '@angular/core';
import { MetricCard } from '../../components/metric-card/metric-card';
import { DashboardTable } from '../../components/dashboard-table/dashboard-table';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { HoldingService } from '../../services/HoldingService';
import { SecurityService } from '../../services/SecurityService';
import { Security } from '../../types/Security';





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

  constructor(
    private investmentAccountService: InvestmentAccountService,
    private holdingService: HoldingService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.loadTotals();
    this.loadRecentAccounts();
    this.loadRecentSecurities();
  }

  loadTotals(): void {
    this.investmentAccountService.getUserInvestmentAccountTotal(1).subscribe({
      next: (data) => {
        this.totalAccounts.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.securityService.getUserSecurityTotal(1).subscribe({
      next: (data) => {
        this.totalSecurities.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.holdingService.getUserHoldingTotal(1).subscribe({
      next: (data) => {
        this.totalHoldings.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.holdingService.totalInvestedCost(1).subscribe({
      next: (data) => {
        this.totalInvestedCost.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  loadRecentAccounts(): void {
    this.investmentAccountService.getRecentAccounts(1).subscribe({
      next: (data) => {
        this.recentAccounts.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  loadRecentSecurities(): void {
    this.securityService.getRecentSecurities(1).subscribe({
      next: (data) => {
        this.recentSecurities.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
