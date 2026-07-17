import { Component, input, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IftaLabelModule } from 'primeng/iftalabel';

import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { InvestmentType } from '../../types/InvestmentType';
import { SelectModule } from 'primeng/select';

import { InputNumberModule } from 'primeng/inputnumber';

import { Security } from '../../types/Security';
import { Holding } from '../../types/Holding';
import { InvestmentAccount } from '../../types/InvestmentAccounts';

/** Add/edit holding modal shared by the account-detail and security-detail pages. */
@Component({
  selector: 'app-manage-holding-modal',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    IftaLabelModule,
    SelectModule,
    InputNumberModule,
  ],
  templateUrl: './manage-holding-modal.html',
  styleUrl: './manage-holding-modal.css',
})
export class ManageHoldingModal {
  /** Dropdown options built from the InvestmentType enum values. */
  readonly accountOptions = Object.values(InvestmentType).map((value) => ({
    name: value,
    value: value,
  }));

  /**
   * Determines whether the modal is being used from the account-detail or security-detail page,
   * which changes which dropdown (security vs. account) is editable.
   */
  viewMode = input.required<'byAccount' | 'bySecurity'>();

  /** Securities not yet held, offered as counterpart choices when adding a holding by account. */
  filteredSecurities = input<Security[]>();

  /** Accounts not yet holding this security, offered as counterpart choices when adding a holding by security. */
  filteredAccounts = input<InvestmentAccount[]>([]);

  /** The holding currently being edited, or `null` when the modal is in "create" mode. */
  editingHolding = input<Holding | null>(null);

  /** Whether the modal is visible. */
  visible = model.required<boolean>();

  /** The display name (account nickname or security name) shown in the modal title. */
  recordName = input.required<string>();

  /** The reactive form backing the modal's fields. */
  form = input.required<FormGroup>();

  /** Emits the form's value when confirmed and valid; the parent owns persistence. */
  confirmed = output<any>();

  /** Emits when the modal is cancelled/closed without confirming. */
  cancelled = output<void>();

  /** Emits the form's value if it passes validation; the parent owns persistence. */
  onUpdate() {
    if (this.form().valid) {
      this.confirmed.emit(this.form().value);
    }
  }
}
