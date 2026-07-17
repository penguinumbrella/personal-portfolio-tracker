import { Component, computed, inject, signal } from '@angular/core';

import { DetailCard } from '../../components/detail-card/detail-card';
import { HoldingTable } from '../../components/holding-table/holding-table';
import { MetricCard } from '../../components/metric-card/metric-card';
import { Security } from '../../types/Security';
import { SecurityService } from '../../services/SecurityService';
import { SidebarItem, DetailSidebar } from '../../components/detail-sidebar/detail-sidebar';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ManageHoldingModal } from '../../components/manage-holding-modal/manage-holding-modal';
import { ManageSecurityModal } from '../../components/manage-security-modal/manage-security-modal';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { BaseDetailDirective } from '../../base/base-detail.directive';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { extractErrorMessage } from '../../shared/http.util';

/** Security detail page: security fields, holdings, and the add/edit security and holding modals. */
@Component({
  selector: 'app-security-detail',
  imports: [
    DetailCard,
    HoldingTable,
    MetricCard,
    DetailSidebar,
    ManageHoldingModal,
    ManageSecurityModal,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './security-detail.html',
  styleUrl: './security-detail.css',
})
export class SecurityDetail extends BaseDetailDirective<Security> {
  private securityService = inject(SecurityService);
  private investmentAccountService = inject(InvestmentAccountService);

  private readonly sidebarPageSize = 10;

  security = signal<Security | null>(null);

  securityFields = signal<{ label: string; value: any }[]>([]);
  sidebarItems = signal<SidebarItem[]>([]);
  sidebarSearch = signal<string>('');
  sidebarPage = signal<number>(0);
  sidebarTotalPages = signal<number>(1);

  editingSecurity = signal<Security | null>(null);
  allAccounts = signal<InvestmentAccount[]>([]);
  isSecurityModalVisible = signal<boolean>(false);

  modalForm = signal<FormGroup>(
    new FormGroup({
      account: new FormControl(null, Validators.required),
      shares: new FormControl(0, [Validators.required, Validators.min(0)]),
      costPerShare: new FormControl(0, [Validators.required, Validators.min(0)]),
      purchaseDate: new FormControl(new Date(), Validators.required),
    }),
  );

  securityForm = signal<FormGroup>(
    new FormGroup({
      tickerSymbol: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      sector: new FormControl('', Validators.required),
      securityType: new FormControl('', Validators.required),
    }),
  );

  protected override readonly counterpartyFormKey = 'account' as const;

  /**
   * Maps the holding modal's raw form data to the account/security id pair the API expects.
   *
   * @param formData the holding modal form's raw value
   * @returns the selected account id and the security id (the security currently being viewed)
   */
  protected resolveHoldingIds(formData: any): { a_id: number; s_id: number } {
    return { a_id: formData.account.id, s_id: this.security()!.id! };
  }

  /**
   * Loads the security sidebar and account list, then honors an `id` route param (set when the
   * security was selected from the menu bar) by viewing that security and cleaning up the URL.
   */
  ngOnInit() {
    this.resolveCurrentUserId(() => {
      this.loadAccounts();
      this.loadSecurities();
      this.actRoute.paramMap.subscribe((params) => {
        const idParam = params.get('id');
        if (idParam) {
          this.viewSecurity(Number(idParam));
          this.location.replaceState('/security');
        }
      });
    });
  }

  /** Loads all accounts for the user, used as candidates for the "add holding" modal. */
  loadAccounts() {
    const userId = this.currentUserId();
    if (userId == null) return;

    this.investmentAccountService.getAllInvestmentAccounts(userId).subscribe({
      next: (data) => {
        this.allAccounts.set(data);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      },
    });
  }

  /** Loads a page of securities for the user (search + pagination aware) and populates the sidebar. */
  loadSecurities() {
    const userId = this.currentUserId();
    if (userId == null) return;

    this.securityService
      .getSecuritiesPageForUser(
        userId,
        this.sidebarPage(),
        this.sidebarPageSize,
        this.sidebarSearch(),
      )
      .subscribe({
        next: (data) => {
          this.sidebarItems.set(
            data.content.map((s) => ({
              id: s.id!,
              label: s.name,
              subtitle: s.type,
            })),
          );
          this.sidebarTotalPages.set(data.totalPages);
        },
        error: (error) => {
          console.error('Error loading securities:', error);
        },
      });
  }

  /**
   * Resets back to page 0 whenever the search term changes, then reloads.
   *
   * @param term the new sidebar search term
   */
  onSidebarSearch(term: string): void {
    this.sidebarSearch.set(term);
    this.sidebarPage.set(0);
    this.loadSecurities();
  }

  /**
   * Switches the sidebar to a different page, then reloads.
   *
   * @param page the zero-based page number to switch to
   */
  onSidebarPageChange(page: number): void {
    this.sidebarPage.set(page);
    this.loadSecurities();
  }

  /** Accounts not yet holding this security, so the add-holding dropdown only offers valid choices. */
  filteredAccounts = computed(() => this.excludeHeld(this.allAccounts(), (h) => h.id?.accountId));

  /**
   * Loads the details and holdings for a security selected from the sidebar.
   *
   * @param item the selected sidebar item
   */
  onSecuritySelect(item: SidebarItem): void {
    this.viewSecurity(item.id);
  }

  /**
   * Fetches a single security by id, then rebuilds its detail-card fields and loads its holdings.
   *
   * @param id the security's id
   */
  viewSecurity(id: number) {
    this.securityService.getSecurityById(id).subscribe({
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

  /** Clears any editing state and opens the security modal in "create" mode. */
  onOpenAddSecurityModal(): void {
    this.editingSecurity.set(null);
    this.securityForm().reset();
    this.isSecurityModalVisible.set(true);
  }

  /**
   * Fetches the holdings for a security, showing a loading spinner while the request is in flight.
   *
   * @param securityId the security's id
   */
  loadHoldings(securityId: number) {
    this.loading.set(true);

    this.holdingService.getAllHoldingsPerSecurity(securityId).subscribe({
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

  /** Builds the label/value fields shown on the security's detail card. */
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

  /** Populates the security modal with the currently viewed security's data and opens it in "edit" mode. */
  editSecurity() {
    this.editingSecurity.set(this.security());
    const currentSecurity = this.security();
    if (!currentSecurity) return;

    this.securityForm().patchValue({
      name: currentSecurity.name,
      tickerSymbol: currentSecurity.tickerSymbol,
      securityType: currentSecurity.type,
      sector: currentSecurity.sector,
    });

    this.isSecurityModalVisible.set(true);
  }

  /** Asks for confirmation before deleting the security, since it cascades to the security's holdings. */
  confirmDeleteSecurity(): void {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete this security? This will also delete all holdings for this security.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.executeDeleteSecurity();
      },
    });
  }

  /** Deletes the currently viewed security and refreshes the sidebar list. */
  private executeDeleteSecurity(): void {
    const security = this.security();
    if (!security?.id) return;

    this.securityService.deleteSecurity(security.id).subscribe({
      next: () => {
        // Clear the currently viewed security/holdings and refresh the sidebar list.
        this.security.set(null);
        this.holdings.set([]);
        this.loadSecurities();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Security deleted successfully.',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: extractErrorMessage(err, 'Failed to delete security.'),
        });
      },
    });
  }

  /**
   * Handles both create and update submissions from the security modal.
   *
   * @param formData the security modal form's raw value
   */
  onSecurityModalConfirm(formData: any) {
    if (this.securityForm().invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete Form',
        detail: 'Please fill out all required fields correctly.',
      });
      return;
    }

    const payload: Security = {
      id: this.editingSecurity()?.id, // Only include if editing
      name: formData.name,
      tickerSymbol: formData.tickerSymbol,
      sector: formData.sector,
      type: formData.securityType,
      generalNotes: formData.generalNotes || '',
      userId: this.currentUserId()!,
    };

    // Branch on whether we're updating an existing security or creating a new one.
    if (this.editingSecurity()) {
      // UPDATE
      this.securityService.updateSecurity(payload.id!, payload).subscribe({
        next: (updatedSecurity) => {
          // Update sidebar list
          this.loadSecurities();

          if (this.security()?.id === updatedSecurity.id) {
            this.security.set(updatedSecurity);
            this.buildSecurityFields();
          }
          this.isSecurityModalVisible.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Security updated successfully.',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: extractErrorMessage(err, 'Failed to update security.'),
          });
        },
      });
    } else {
      // CREATE
      this.securityService.createSecurity(payload).subscribe({
        next: (newSecurity) => {
          this.loadSecurities();
          this.isSecurityModalVisible.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Security added successfully!',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: extractErrorMessage(err, 'Failed to create security.'),
          });
        },
      });
    }
  }
}
