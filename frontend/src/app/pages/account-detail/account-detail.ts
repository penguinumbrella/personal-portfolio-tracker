import { Component, signal } from '@angular/core';

import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { DetailCard } from '../../components/detail-card/detail-card';
import { HoldingTable } from '../../components/holding-table/holding-table';
import { MetricCard } from '../../components/metric-card/metric-card';
import { HoldingService } from '../../services/HoldingService';
import { Holding } from '../../types/Holding';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { TableLazyLoadEvent } from 'primeng/types/table';

@Component({
  selector: 'app-account-detail',
  imports: [DetailCard, HoldingTable, MetricCard],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css',
})
export class AccountDetail {
  holdings = signal<Holding[]>([]);
  account = signal<InvestmentAccount | null>(null);
  loading = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private holdingService: HoldingService,
  ) {}

  ngOnInit() {
    // Use ActivatedRoute to get the accountId from url params
    const accountId = Number(this.route.snapshot.params['accountId']);
    this.loadHoldings(accountId);
  }

  loadHoldings(accountId: number, event?: TableLazyLoadEvent) {
    const page = event ? event?.first! / event?.rows! : 0;
    const size = event ? event?.rows! : 2;

    // show loading spinner while request to backend is being made
    this.loading.set(true);

    //TODO make this paginated??
    this.holdingService.getAllHoldingsPerAccount(accountId).subscribe({
      next: (data) => {
        this.holdings.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading holdings:', error);
      },
    });
  }

  accounts: any;
  onAccountSelect($event: Event) {
    throw new Error('Method not implemented.');
  }

  accountMetrics: any;
  accountFields: any;
  editAccount() {
    throw new Error('Method not implemented.');
  }
  deleteAccount() {
    throw new Error('Method not implemented.');
  }

  // HOLDING CRUD methods
  addHolding() {
    throw new Error('Method not implemented.');
  }

  editHolding(holding: Holding): void {
    throw new Error('Method not implemented.');
  }

  deleteHolding(holding: Holding): void {
    throw new Error('Method not implemented.');
    // remember to also reload metrics
  }
}
