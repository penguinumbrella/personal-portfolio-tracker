import { Component, signal } from '@angular/core';

import { DetailCard } from '../../components/detail-card/detail-card';
import { HoldingTable } from '../../components/holding-table/holding-table';
import { MetricCard } from '../../components/metric-card/metric-card';
import { HoldingService } from '../../services/HoldingService';
import { Holding } from '../../types/Holding';
import { TableLazyLoadEvent } from 'primeng/types/table';
import { Security } from '../../types/Security';
import { SecurityService } from '../../services/SecurityService';
import { SidebarItem, DetailSidebar } from '../../components/detail-sidebar/detail-sidebar';

@Component({
  selector: 'app-security-detail',
  imports: [DetailCard, HoldingTable, MetricCard, DetailSidebar],
  templateUrl: './security-detail.html',
  styleUrl: './security-detail.css',
})
export class SecurityDetail {
  holdings = signal<Holding[]>([]);
  security = signal<Security | null>(null);
  loading = signal<boolean>(false);
  totalInvestedCost = signal<number>(0);
  securityFields = signal<{ label: string; value: any }[]>([]);
  sidebarItems = signal<SidebarItem[]>([]);

  constructor(
    private holdingService: HoldingService,
    private securityService: SecurityService,
  ) {}

  // get the list of securities on page load
  ngOnInit() {
    this.loadSecurities();
  }

  // load the list of securities for the user and populate the sidebar
  loadSecurities() {
    this.securityService.getAllSecuritiesByUser(1).subscribe({
      next: (data) => {
        console.log('data:', data);
        this.sidebarItems.set(
          data.map((s) => ({
            id: s.id!,
            label: s.name,
            subtitle: s.type,
          })),
        );
      },
      error: (error) => {
        console.error('Error loading securities:', error);
      },
    });
  }

  // when a security is selected from sidebar, get security and load details, holdings
  onSecuritySelect(item: SidebarItem): void {
    this.securityService.getSecurityById(item.id).subscribe({
      next: (data) => {
        this.security.set(data);
        this.buildSecurityFields();
        this.loadHoldings(data.id!);
      },
      error: (err) => {
        console.error('Error loading security:', err);
      },
    });
  }

  // load holdings. invested cost calculated in loadHoldings() after holdings are loaded to avoid race condition
  loadHoldings(securityId: number, event?: TableLazyLoadEvent) {
    const page = event ? event?.first! / event?.rows! : 0;
    const size = event ? event?.rows! : 2;

    // show loading spinner while request to backend is being made
    this.loading.set(true);

    //TODO make this paginated??
    this.holdingService.getAllHoldingsPerSecurity(securityId).subscribe({
      next: (data) => {
        this.holdings.set(data);
        this.loading.set(false);
        this.calcInvestedCost();
      },
      error: (error) => {
        console.error('Error loading holdings:', error);
      },
    });
  }

  // build the fields for the detail card
  buildSecurityFields(): void {
    const s = this.security();
    if (!s) return;
    this.securityFields.set([
      { label: 'Name', value: s.name },
      { label: 'Ticker', value: s.tickerSymbol },
      { label: 'Security Type', value: s.type },
      { label: 'Sector', value: s.sector },
    ]);
  }

  calcInvestedCost(): void {
    const total = this.holdings().reduce((acc, h) => acc + h.shares * h.costPerShare, 0);
    this.totalInvestedCost.set(total);
  }

  // CRUDS BELOW
  editSecurity() {
    throw new Error('Method not implemented.');
  }
  deleteSecurity() {
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
              h.id?.securityId !== holding.id?.securityId ||
              h.id?.securityId !== holding.id?.securityId,
          ),
        );
      },
      error: (err) => console.error(err),
    });
  }
}
