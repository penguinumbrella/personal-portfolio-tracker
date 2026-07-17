import { Component, input, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InvestmentType } from '../../types/InvestmentType';

/** Add/edit investment account modal used on the account-detail page. */
@Component({
  selector: 'app-manage-account-modal',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule
  ],
  templateUrl: './manage-account-modal.html',
  styleUrl: './manage-account-modal.css',
})
export class ManageAccountModal {

  /** Dropdown options built from the InvestmentType enum values. */
  readonly accountTypes = Object.values(InvestmentType).map(value => ({
    name: value,
    value: value
  }));

  /** The account currently being edited, or `null` when the modal is in "create" mode. */
  editingAccount = input<any | null>(null);

  /** Whether the modal is visible. */
  visible = model.required<boolean>();

  /** The reactive form backing the modal's fields. */
  form = input.required<FormGroup>();

  /** Emits the form's raw value when confirmed; the parent owns validation/persistence. */
  confirmed = output<any>();

  /** Emits when the modal is cancelled/closed without confirming. */
  cancelled = output<void>();

  /** Hands the raw form value up to the parent, which owns validation/persistence. */
  onUpdate() {
    this.confirmed.emit(this.form().value);
  }
}