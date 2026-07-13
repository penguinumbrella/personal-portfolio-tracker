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

@Component({
  selector: 'app-security-detail',
  imports: [DetailCard, HoldingTable, MetricCard, DetailSidebar, ManageHoldingModal, ManageSecurityModal, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './security-detail.html',
  styleUrl: './security-detail.css',
})
export class SecurityDetail extends BaseDetailDirective<Security> {
  private securityService = inject(SecurityService);
  private investmentAccountService = inject(InvestmentAccountService);

  security = signal<Security | null>(null);

  securityFields = signal<{ label: string; value: any }[]>([]);
  sidebarItems = signal<SidebarItem[]>([]);

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
    })
  );

  protected override readonly counterpartyFormKey = 'account' as const;

  protected resolveHoldingIds(formData: any): { a_id: number; s_id: number } {
    return { a_id: formData.account.id, s_id: this.security()!.id! };
  }

  // get the list of securities on page load
  ngOnInit() {
    this.resolveCurrentUserId(() => {
      this.loadAccounts();
      this.loadSecurities();
    });
  }

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

  // load the list of securities for the user and populate the sidebar
  loadSecurities() {
    const userId = this.currentUserId();
    if (userId == null) return;

    this.securityService.getAllSecuritiesByUser(userId).subscribe({
      next: (data) => {
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

  filteredAccounts = computed(() => this.excludeHeld(this.allAccounts(), (h) => h.id?.accountId));

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

  onOpenAddSecurityModal(): void {
    this.editingSecurity.set(null);
    this.securityForm().reset();
    this.isSecurityModalVisible.set(true);
  }

  // load holdings for the selected security
  loadHoldings(securityId: number) {
    // show loading spinner while request to backend is being made
    this.loading.set(true);

    //TODO make this paginated??
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

  // CRUDS BELOW

  editSecurity() {
    this.editingSecurity.set(this.security());
    const currentSecurity = this.security();
    if (!currentSecurity) return;

    this.securityForm().patchValue({
      name: currentSecurity.name,
      tickerSymbol: currentSecurity.tickerSymbol,
      securityType: currentSecurity.type,
      sector: currentSecurity.sector
    });

    this.isSecurityModalVisible.set(true);
  }

  confirmDeleteSecurity(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this security? This will also delete all holdings for this security.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.executeDeleteSecurity();
      }
    });
  }

  private executeDeleteSecurity(): void {
    const security = this.security();
    if (!security?.id) return;

    this.securityService.deleteSecurity(security.id).subscribe({
      next: () => {
        this.security.set(null);
        this.holdings.set([]);
        this.loadSecurities();
      },
      error: (err) => console.error('Delete failed:', err),
    });
  }

  onSecurityModalConfirm(formData: any) {
    if (this.securityForm().invalid) {
      return;
    }

    const payload: Security = {
      id: this.editingSecurity()?.id, // Only include if editing
      name: formData.name,
      tickerSymbol: formData.tickerSymbol,
      sector: formData.sector,
      type: formData.securityType,
      generalNotes: formData.generalNotes || "",
      userId: this.currentUserId()!
    };

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
        },
        error: (err) => {
          console.error('Error updating security:', err);
        }
      });
    } else {
      // CREATE
      this.securityService.createSecurity(payload).subscribe({
        next: (newSecurity) => {
          this.loadSecurities(); // Refresh sidebar
          this.isSecurityModalVisible.set(false);
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    }
  }
}
