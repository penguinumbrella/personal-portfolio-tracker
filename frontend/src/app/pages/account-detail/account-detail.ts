import { Component, computed, inject, signal } from '@angular/core';

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

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { extractErrorMessage } from '../../shared/http.util';

@Component({
  selector: 'app-account-detail',
  imports: [
    DetailCard,
    HoldingTable,
    MetricCard,
    DetailSidebar,
    ManageHoldingModal,
    ManageAccountModal,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css',
})
export class AccountDetail extends BaseDetailDirective<InvestmentAccount> {
  private investmentAccountService = inject(InvestmentAccountService);
  private securityService = inject(SecurityService);

  private readonly sidebarPageSize = 10;

  account = signal<InvestmentAccount | null>(null);
  accountFields = signal<{ label: string; value: any }[]>([]);
  sidebarItems = signal<SidebarItem[]>([]);
  sidebarSearch = signal<string>('');
  sidebarPage = signal<number>(0);
  sidebarTotalPages = signal<number>(1);

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
    }),
  );

  protected override readonly counterpartyFormKey = 'security' as const;

  // Maps the holding modal's raw form data to the account/security id pair the API expects.
  protected resolveHoldingIds(formData: any): { a_id: number; s_id: number } {
    return { a_id: this.account()!.id!, s_id: formData.security.id };
  }

  // page loads all accounts on the side and waits for one to be selected
  ngOnInit() {
    this.resolveCurrentUserId(() => {
      this.loadAccounts();
      this.loadSecurities();
      // allows selections from menu bar
      this.actRoute.paramMap.subscribe((params) => {
        const idParam = params.get('id');
        if (idParam) {
          this.viewAccount(Number(idParam));
          // fixes url from menu bar selection (that passes account id)
          this.location.replaceState('/account');
        }
      });
    });
  }

  // Fetch a page of accounts (search + pagination aware) and map them into sidebar list items.
  loadAccounts() {
    const userId = this.currentUserId();
    if (userId == null) return;

    this.investmentAccountService
      .getAccountsPage(userId, this.sidebarPage(), this.sidebarPageSize, this.sidebarSearch())
      .subscribe({
        next: (data) => {
          this.sidebarItems.set(
            data.content.map((a) => ({
              id: a.id!,
              label: a.nickname,
              subtitle: a.institutionName,
            })),
          );
          this.sidebarTotalPages.set(data.totalPages);
        },
        error: (error) => {
          console.error('Error loading accounts:', error);
        },
      });
  }

  // Reset back to page 0 whenever the search term changes, then reload.
  onSidebarSearch(term: string): void {
    this.sidebarSearch.set(term);
    this.sidebarPage.set(0);
    this.loadAccounts();
  }

  onSidebarPageChange(page: number): void {
    this.sidebarPage.set(page);
    this.loadAccounts();
  }

  // Load all securities for the user, used as candidates for the "add holding" modal.
  loadSecurities() {
    const userId = this.currentUserId();
    if (userId == null) return;

    this.securityService.getAllSecuritiesByUser(userId).subscribe({
      next: (data) => {
        this.allSecurities.set(data);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      },
    });
  }

  // Securities not yet held in this account, so the add-holding dropdown only offers valid choices.
  filteredSecurities = computed(() =>
    this.excludeHeld(this.allSecurities(), (h) => h.id?.securityId),
  );

  // when an account is selected from the sidebar, load the holdings for that account
  onAccountSelect(item: SidebarItem): void {
    this.viewAccount(item.id);
  }

  // Fetch a single account by id, then rebuild its detail-card fields and load its holdings.
  viewAccount(id: number) {
    this.investmentAccountService.getInvestmentAccountById(id).subscribe({
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

  // Clear any editing state and open the account modal in "create" mode.
  onOpenAddAccountModal(): void {
    this.editingAccount.set(null);
    this.accountForm().reset();
    this.isAccountModalVisible.set(true);
  }

  loadHoldings(accountId: number) {
    // show loading spinner while request to backend is being made
    this.loading.set(true);

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

  // Populate the account modal with the currently viewed account's data and open it in "edit" mode.
  editAccount() {
    this.editingAccount.set(this.account());
    const currentAccount = this.account();
    if (!currentAccount) return;

    // Normalize dateOpened to yyyy-MM-dd for the date input.
    const dateString = new Date(currentAccount.dateOpened).toISOString().split('T')[0];

    this.accountForm().patchValue({
      nickname: currentAccount.nickname,
      institutionName: currentAccount.institutionName,
      accountType: currentAccount.accountType,
      dateOpened: currentAccount.dateOpened,
    });

    this.isAccountModalVisible.set(true);
  }

  // Ask for confirmation before deleting, since it cascades to the account's holdings.
  confirmDeleteAccount(): void {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete this account? This will also delete all holdings in this account.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.executeDeleteAccount();
      },
    });
  }

  private executeDeleteAccount(): void {
    const account = this.account();
    if (!account?.id) return;

    this.investmentAccountService.deleteInvestmentAccount(account.id).subscribe({
      next: () => {
        // Clear the currently viewed account/holdings and refresh the sidebar list.
        this.account.set(null);
        this.holdings.set([]);
        this.loadAccounts();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Account deleted successfully.',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: extractErrorMessage(err, 'Failed to delete account.'),
        });
      },
    });
  }

  // Handles both create and update submissions from the account modal.
  onAccountModalConfirm(formData: any) {
    if (this.accountForm().invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete Form',
        detail: 'Please fill out all required fields correctly.',
      });
      return;
    }

    // Merge form data over the existing account (if editing), preserving the original dateOpened.
    const payload: InvestmentAccount = {
      ...this.editingAccount(),
      ...formData,
      dateOpened: this.editingAccount()?.dateOpened || new Date(),
      userId: this.currentUserId()!,
    };

    // Branch on whether we're updating an existing account or creating a new one.
    if (this.editingAccount()) {
      this.investmentAccountService.updateInvestmentAccount(payload.id!, payload).subscribe({
        next: (updatedAccount) => {
          this.loadAccounts();
          // If the account being edited is the one currently on screen, refresh its display too.
          if (this.account()?.id === updatedAccount.id) {
            this.account.set(updatedAccount);
            this.buildAccountFields();
          }
          this.isAccountModalVisible.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Account updated successfully.',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: extractErrorMessage(err, 'Failed to update account.'),
          });
        },
      });
    } else {
      this.investmentAccountService.createInvestmentAccount(payload).subscribe({
        next: (newAccount) => {
          this.loadAccounts();
          this.isAccountModalVisible.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Account created successfully.',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: extractErrorMessage(err, 'Failed to create account.'),
          });
        },
      });
    }
  }
}
