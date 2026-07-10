import { Component, computed, signal } from '@angular/core';

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
import { SecurityService } from '../../services/SecurityService';
import { Security } from '../../types/Security';
import { ManageAccountModal } from '../../components/manage-account-modal/manage-account-modal';

@Component({
  selector: 'app-account-detail',
  imports: [DetailCard, HoldingTable, MetricCard, DetailSidebar, ManageHoldingModal, ManageAccountModal],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css',
})
export class AccountDetail {
  holdings = signal<Holding[]>([]);
  account = signal<InvestmentAccount | null>(null);
  loading = signal<boolean>(false);
  totalInvestedCost = signal<number>(0);
  accountFields = signal<{ label: string; value: any }[]>([]);
  sidebarItems = signal<SidebarItem[]>([]);

  isHoldingModalVisible = signal<boolean>(false);
  editingHolding = signal<Holding | null>(null);
  editingAccount = signal<InvestmentAccount | null>(null);
  allSecurities = signal<Security[]>([]);
  isAccountModalVisible = signal<boolean>(false);

  modalForm = signal<FormGroup>(
    new FormGroup({
      security: new FormControl(null, Validators.required),
      shares: new FormControl(0, [Validators.required, Validators.min(0)]),
      costPerShare: new FormControl(0, [Validators.required, Validators.min(0)]),
      purchaseDate: new FormControl(new Date(), Validators.required),
    }),
  );

  accountForm = signal<FormGroup>(
    new FormGroup({
      nickname: new FormControl('', Validators.required),
      institutionName: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required),
    })
  );

  constructor(
    private holdingService: HoldingService,
    private investmentAccountService: InvestmentAccountService,
    private securityService: SecurityService,
  ) {}

  // page loads all accounts on the side and waits for one to be selected
  ngOnInit() {
    this.loadAccounts();
    this.loadSecurities();
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

  loadSecurities() {
    this.securityService.getAllSecuritiesByUser(1).subscribe({
      next: (data) => {
        console.log('data:', data);
        this.allSecurities.set(data);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      },
    });
  }

  filteredSecurities = computed(() => {
    const all = this.allSecurities();
    const currentHoldings = this.holdings();
    
    // Get a set of IDs currently held in this account for O(1) lookup
    const heldSecurityIds = new Set(currentHoldings.map(h => h.id?.securityId));

    console.log('All securities:', all);
    
    // Only return securities not in that set
    return all.filter(s => !heldSecurityIds.has(s.id));
  });

  // when an account is selected from the sidebar, load the holdings for that account
  onAccountSelect(item: SidebarItem): void {
    this.investmentAccountService.getInvestmentAccountById(item.id).subscribe({
      next: (data) => {
        this.account.set(data);
        this.buildAccountFields();
        this.loadHoldings(data.id!);
      },
      error: (err) => {
        console.error('Error loading account:', err);
      },
    });
  }

  onOpenAddAccountModal(): void {
    this.editingAccount.set(null); 
    this.accountForm().reset();
    this.isAccountModalVisible.set(true);
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
        this.calcInvestedCost();
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

  calcInvestedCost(): void {
    const total = this.holdings().reduce((acc, h) => acc + h.shares * h.costPerShare, 0);
    this.totalInvestedCost.set(total);
  }

  editAccount() {
    this.editingAccount.set(this.account());
    const currentAccount = this.account();
    if (!currentAccount) return;


    this.accountForm().patchValue({
      nickname: currentAccount.nickname,
      institutionName: currentAccount.institutionName,
      accountType: currentAccount.accountType,
      dateOpened: new Date(currentAccount.dateOpened)
    });

    this.isAccountModalVisible.set(true);
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

    console.log('Editing holding:', holding, 'with id:', holding.id);

    const dateValue =
      typeof holding.purchaseDate === 'number'
        ? new Date(holding.purchaseDate)
        : holding.purchaseDate;

    this.modalForm().patchValue({
      security: holding.security,
      shares: holding.shares,
      costPerShare: holding.costPerShare,
      purchaseDate: dateValue,
    });

    this.isHoldingModalVisible.set(true);
  }

  onHoldingModalConfirm(formData: any) {
    if (this.modalForm().invalid) return;

    const payload = {
      id: this.editingHolding()?.id,
      a_id: this.account()!.id,
      s_id: formData.security.id,
      //id:  // todo
      //accountId: this.account()!.id, // Assuming account is always set when adding/editing a holding
      shares: formData.shares,
      costPerShare: formData.costPerShare,
      purchaseDate:
        formData.purchaseDate instanceof Date
          ? formData.purchaseDate.getTime()
          : formData.purchaseDate,
    };

    console.log('Payload to send to backend:', payload);

    if (this.modalForm().invalid) {
      return;
    }
    if (this.editingHolding()) {
      const id = payload.id;
      // Call update service
      this.holdingService.updateHolding(id!, payload).subscribe({
        next: (updatedHolding) => {
          this.holdings.update((current) => current.map((h) => (h.id === id ? updatedHolding : h)));
        },
        error: (err) => console.error(err),
      });
      console.log('Updating', formData);
    } else {
      // Call create service
      // create and send payload to backend

      this.holdingService.createHolding(payload).subscribe({
        next: (newHolding) => {
          this.holdings.update((current) => [...current, newHolding]);
        },
        error: (err) => console.error(err),
      });

      console.log('Creating', formData);
    }
    this.isHoldingModalVisible.set(false);
  }

onAccountModalConfirm(formData: any) {
  if (this.accountForm().invalid) {
    console.log('Form is invalid.');
    return;
  }

    const payload: InvestmentAccount = {
      ...this.editingAccount(), 
      ...formData,
      dateOpened: this.editingAccount()?.dateOpened || new Date(),
      userId: 1, // TODO: Replace with actual user ID when available
    };

    console.log(payload);

    if (this.editingAccount()) {
      // UPDATE
      console.log('Updating account with ID:', payload.id);
      this.investmentAccountService.updateInvestmentAccount(payload.id!, payload).subscribe({
        next: (updatedAccount) => {
          // Update sidebar list
          this.loadAccounts(); 

          if (this.account()?.id === updatedAccount.id) {
              this.account.set(updatedAccount);
              this.buildAccountFields();
          }
          this.isAccountModalVisible.set(false);
        },
        error: (err) => {
          console.error('Error updating account:', err)

          console.error('Error:', err);
        }
      });
    } else {
      // CREATE
      this.investmentAccountService.createInvestmentAccount(payload).subscribe({
        next: (newAccount) => {
          this.loadAccounts(); // Refresh sidebar
          this.isAccountModalVisible.set(false);
        },
        error: (err) => {

          console.error('Error:', err);

      }
      });
    }

    
  }

  deleteHolding(holding: Holding): void {
    // TODO reload metrics
    // TODO add modal to confirm deletion

    this.holdingService.deleteHolding(holding.id!).subscribe({
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
