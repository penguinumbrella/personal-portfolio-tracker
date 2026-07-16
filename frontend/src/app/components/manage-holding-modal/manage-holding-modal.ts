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
  // Build dropdown options from the InvestmentType enum values
  readonly accountOptions = Object.values(InvestmentType).map((value) => ({
    name: value,
    value: value,
  }));

  // creating values that need to be passed in by the parent

  // Determines whether the modal is being used from the account-detail or security-detail page,
  // which changes which dropdown (security vs. account) is editable
  viewMode = input.required<'byAccount' | 'bySecurity'>();

  filteredSecurities = input<Security[]>();
  filteredAccounts = input<InvestmentAccount[]>([]);
  editingHolding = input<Holding | null>(null);
  visible = model.required<boolean>();
  recordName = input.required<string>();
  form = input.required<FormGroup>();

  // creating events for when the deletion is confirmed or cancelled - needs to be handled by parent
  confirmed = output<any>();
  cancelled = output<void>();

  onUpdate() {
    // Only emit if the form passes validation; parent owns persistence
    if (this.form().valid) {
      this.confirmed.emit(this.form().value);
    }
  }
}
