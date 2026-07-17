import { Component, input, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Sector} from "../../types/Sector";
import { SecurityType } from '../../types/SecurityType';

/** Add/edit security modal used on the security-detail page. */
@Component({
  selector: 'app-manage-security-modal',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule
  ],
  templateUrl: './manage-security-modal.html',
  styleUrl: './manage-security-modal.css',
})
export class ManageSecurityModal {

  /** Dropdown options built from the Sector enum values. */
  readonly sectorTypes = Object.values(Sector).map(value => ({ name: value, value }));

  /** Dropdown options built from the SecurityType enum values. */
  readonly securityTypes = Object.values(SecurityType).map(value => ({ name: value, value }));

  /** The security currently being edited, or `null` when the modal is in "create" mode. */
  editingSecurity = input<any | null>(null);

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