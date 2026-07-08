import { Component, signal } from '@angular/core';

import { DetailCard } from '../../components/detail-card/detail-card';
import { HoldingTable } from '../../components/holding-table/holding-table';
import { MetricCard } from '../../components/metric-card/metric-card';
import { HoldingService } from '../../services/HoldingService';
import { Holding } from '../../types/Holding';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { TableLazyLoadEvent } from 'primeng/types/table';
import { SidebarItem, DetailSidebar } from '../../components/detail-sidebar/detail-sidebar';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ManageHoldingModal } from '../../components/manage-holding-modal/manage-holding-modal';

@Component({
  selector: 'app-account-detail',
  imports: [DetailCard, HoldingTable, MetricCard, DetailSidebar, ManageHoldingModal],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css',
})
export class AccountDetail {
  holdings = signal<Holding[]>([]);
  account = signal<InvestmentAccount | null>(null);
  loading = signal<boolean>(false);
  accountFields = signal<{ label: string; value: any }[]>([]);
  sidebarItems = signal<SidebarItem[]>([]);
  isHoldingModalVisible = signal<boolean>(false);
  editingHolding = signal<Holding | null>(null);
  

  modalForm = signal<FormGroup>(new FormGroup({
    shares: new FormControl(0, [Validators.required, Validators.min(0)]),
    costPerShare: new FormControl(0, [Validators.required, Validators.min(0)]),
    purchaseDate: new FormControl(new Date(), Validators.required)
  }));

  constructor(
    private holdingService: HoldingService,
    private investmentAccountService: InvestmentAccountService,
  ) {}

  
  // page loads all accounts on the side and waits for one to be selected
  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    // TODO how do we get the userId???? For now, hardcoding to 1
    this.investmentAccountService.getAllInvestmentAccounts(1).subscribe({
      next: (data) => {
        console.log('data:', data);
        this.sidebarItems.set(
          data.map((a) => ({
            id: a.id!,
            label: a.nickname,
            subtitle: a.institutionName,
          })),
        );
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      },
    });
  }

  // when an account is selected from the sidebar, load the holdings for that account
  onAccountSelect(item: SidebarItem): void {
    this.loadHoldings(item.id);
  }

  loadHoldings(accountId: number, event?: TableLazyLoadEvent) {
    const page = event ? event?.first! / event?.rows! : 0;
    const size = event ? event?.rows! : 2;

    // show loading spinner while request to backend is being made
    this.loading.set(true);

    //TODO make this paginated?? is it already?????
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

  

  editAccount() {
    throw new Error('Method not implemented.');
  }
  deleteAccount() {
    throw new Error('Method not implemented.');
  }

addHolding() {
  this.editingHolding.set(null);
  this.modalForm().reset();
  this.isHoldingModalVisible.set(true);
}

editHolding(holding: Holding): void {
  this.editingHolding.set(holding);

  const dateValue = typeof holding.purchaseDate === 'number' 
    ? new Date(holding.purchaseDate) 
    : holding.purchaseDate;

  this.modalForm().patchValue({
    shares: holding.shares,
    costPerShare: holding.costPerShare,
    purchaseDate: dateValue
  });
  
  this.isHoldingModalVisible.set(true);
}

onHoldingModalConfirm(formData: any) {
  if(this.modalForm().invalid) {
      return;
    }
  if (this.editingHolding()) {
    // Call update service
    console.log("Updating", formData);
  } else {
    // Call create service
    console.log("Creating", formData);
  }
  this.isHoldingModalVisible.set(false);
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
