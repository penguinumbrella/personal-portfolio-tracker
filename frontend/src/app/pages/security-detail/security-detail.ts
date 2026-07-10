import { Component, computed, signal } from '@angular/core';

import { DetailCard } from '../../components/detail-card/detail-card';
import { HoldingTable } from '../../components/holding-table/holding-table';
import { MetricCard } from '../../components/metric-card/metric-card';
import { HoldingService } from '../../services/HoldingService';
import { Holding } from '../../types/Holding';
import { TableLazyLoadEvent } from 'primeng/types/table';
import { Security } from '../../types/Security';
import { SecurityService } from '../../services/SecurityService';
import { SidebarItem, DetailSidebar } from '../../components/detail-sidebar/detail-sidebar';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ManageHoldingModal } from '../../components/manage-holding-modal/manage-holding-modal';
import { ManageSecurityModal } from '../../components/manage-security-modal/manage-security-modal';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';

@Component({
  selector: 'app-security-detail',
  imports: [DetailCard, HoldingTable, MetricCard, DetailSidebar, ManageHoldingModal, ManageSecurityModal],
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

  isHoldingModalVisible = signal<boolean>(false);
  editingHolding = signal<Holding | null>(null);
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

  constructor(
    private holdingService: HoldingService,
    private securityService: SecurityService,
    private investmentAccountService: InvestmentAccountService
  ) {}

  // get the list of securities on page load
  ngOnInit() {
    this.loadAccounts();
    this.loadSecurities();
  }

  loadAccounts() {
    // TODO how do we get the userId???? For now, hardcoding to 1
    this.investmentAccountService.getAllInvestmentAccounts(1).subscribe({
      next: (data) => {
        console.log('data:', data);
        this.allAccounts.set(data);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      },
    });
  }

  // load the list of securities for the user and populate the sidebar
  loadSecurities() {
    this.securityService.getAllSecuritiesByUser(1).subscribe({
      next: (data) => {
        //console.log('data:', data);
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

    filteredAccounts = computed(() => {
      const all = this.allAccounts();
      const currentHoldings = this.holdings();
      
      // Get a set of IDs currently held in this account for O(1) lookup
      const heldAccountIds = new Set(currentHoldings.map(h => h.id?.accountId));
      
      // Only return securities not in that set
      console.log('All accounts:', all);
      return all.filter(s => !heldAccountIds.has(s.id));
    });


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
    this.editingSecurity.set(this.security());
    const currentSecurity = this.security();
    if (!currentSecurity) return;


    this.securityForm().patchValue({
      name: currentSecurity.name,
      tickerSymbol: currentSecurity.tickerSymbol,
      type: currentSecurity.type,
      sector: currentSecurity.sector
    });

    this.isSecurityModalVisible.set(true);
  }

  deleteSecurity() {
    throw new Error('Method not implemented.');
  }

  // HOLDING CRUD methods

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
      a_id: formData.account.id, // Now coming from the account dropdown
      s_id: this.security()!.id, // Fixed to current security view
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

onSecurityModalConfirm(formData: any) {
  if (this.securityForm().invalid) {
    console.log('Form is invalid.');
    return;
  }

    const payload: Security = {
      id: this.editingSecurity()?.id, // Only include if editing
      name: formData.name,
      tickerSymbol: formData.tickerSymbol,
      sector: formData.sector,
      type: formData.securityType,
      generalNotes: formData.generalNotes || "",
      userId: 1
    };

    console.log(payload);

    if (this.editingSecurity()) {
      // UPDATE
      console.log('Updating security with ID:', payload.id);
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
          console.error('Error updating security:', err)

          console.error('Error:', err);
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
          console.log('Error creating security:', payload, err);
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
              h.id?.securityId !== holding.id?.securityId ||
              h.id?.securityId !== holding.id?.securityId,
          ),
        );
      },
      error: (err) => console.error(err),
    });
  }
}
