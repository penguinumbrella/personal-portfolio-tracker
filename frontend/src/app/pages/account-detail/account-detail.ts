import { Component, signal } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
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
  accountFields = signal<{ label: string; value: any }[]>([]);

  constructor(
    private route: ActivatedRoute,
    private holdingService: HoldingService,
  ) {}

  ngOnInit() {
    //Use ActivatedRoute to get the accountId from url params
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
        console.log('data:', data);
        this.holdings.set(data);
        this.loading.set(false);
        this.account.set(this.holdings()[0].account);
        this.buildAccountFields();
      },
      error: (error) => {
        console.error('Error loading holdings:', error);
      },
    });
  }

  // build the fields for the detail card
  buildAccountFields(): void {
    const a = this.account();
    if (!a) return;
    this.accountFields.set([
      { label: 'Institution', value: a.institutionName },
      { label: 'Account Type', value: a.accountType },
      { label: 'Nickname', value: a.nickname },
      { label: 'Opened', value: a.dateOpened },
    ]);
  }

  onAccountSelect($event: Event) {
    // TODO load new account when selected
    throw new Error('Method not implemented.');
  }

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
    // TODO reload metrics
    // TODO add modal to confirm deletion

    this.holdingService.deleteHolding(holding.id).subscribe({
      next: () => {
        this.holdings.update((current) =>
          current.filter(
            (h) =>
              h.id?.accountId !== holding.id?.accountId ||
              h.id?.securityId !== holding.id?.securityId,
          ),
        );
      },
      error: (err) => console.error(err),
    });
  }
}
