import { Component, computed, signal } from '@angular/core';

import { DetailCard } from '../../components/detail-card/detail-card';
import { HoldingTable } from '../../components/holding-table/holding-table';
import { MetricCard } from '../../components/metric-card/metric-card';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { SidebarItem, DetailSidebar } from '../../components/detail-sidebar/detail-sidebar';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ManageHoldingModal } from '../../components/manage-holding-modal/manage-holding-modal';
import { SecurityService } from '../../services/SecurityService';
import { Security } from '../../types/Security';
import { ManageAccountModal } from '../../components/manage-account-modal/manage-account-modal';
import { BaseDetailDirective } from '../../base/base-detail.directive';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-account-detail',
  imports: [DetailCard, HoldingTable, MetricCard, DetailSidebar, ManageHoldingModal, ManageAccountModal, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css',
})
export class AccountDetail extends BaseDetailDirective<InvestmentAccount> {
  account = signal<InvestmentAccount | null>(null);
  accountFields = signal<{ label: string; value: any }[]>([]);
  sidebarItems = signal<SidebarItem[]>([]);

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

  protected override readonly counterpartyFormKey = 'security' as const;

  constructor(
    private investmentAccountService: InvestmentAccountService,
    private securityService: SecurityService,
  ) {
    super();
  }

  protected resolveHoldingIds(formData: any): { a_id: number; s_id: number } {
    return { a_id: this.account()!.id!, s_id: formData.security.id };
  }

  // page loads all accounts on the side and waits for one to be selected
  ngOnInit() {
    this.loadAccounts();
    this.loadSecurities();
  }

  loadAccounts() {
    // TODO how do we get the userId???? For now, hardcoding to 1
    this.investmentAccountService.getAllInvestmentAccounts(1).subscribe({
      next: (data) => {
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
        this.allSecurities.set(data);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      },
    });
  }

  filteredSecurities = computed(() => this.excludeHeld(this.allSecurities(), (h) => h.id?.securityId));

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

  loadHoldings(accountId: number) {
    // show loading spinner while request to backend is being made
    this.loading.set(true);

    //TODO make this paginated?? is it already?????
    this.holdingService.getAllHoldingsPerAccount(accountId).subscribe({
      next: (data) => {
        this.holdings.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading holdings:', error);
        this.loading.set(false);
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
    this.editingAccount.set(this.account());
    const currentAccount = this.account();
    if (!currentAccount) return;

    const dateString = new Date(currentAccount.dateOpened).toISOString().split('T')[0];

    this.accountForm().patchValue({
      nickname: currentAccount.nickname,
      institutionName: currentAccount.institutionName,
      accountType: currentAccount.accountType,
      dateOpened: dateString
    });

    this.isAccountModalVisible.set(true);
  }

  confirmDeleteAccount(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this account? This will also delete all holdings in this account.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.executeDeleteAccount();
      }
    });
  }

  private executeDeleteAccount(): void {
    const account = this.account();
    if (!account?.id) return;

    this.investmentAccountService.deleteInvestmentAccount(account.id).subscribe({
      next: () => {
        this.account.set(null);
        this.holdings.set([]);
        this.loadAccounts();
      },
      error: (err) => console.error('Delete failed:', err),
    });
  }

  onAccountModalConfirm(formData: any) {
    if (this.accountForm().invalid) {
      return;
    }

    const payload: InvestmentAccount = {
      ...this.editingAccount(),
      ...formData,
      dateOpened: this.editingAccount()?.dateOpened || new Date(),
      userId: 1, // TODO: Replace with actual user ID when available
    };

    if (this.editingAccount()) {
      // UPDATE
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
          console.error('Error updating account:', err);
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
}
