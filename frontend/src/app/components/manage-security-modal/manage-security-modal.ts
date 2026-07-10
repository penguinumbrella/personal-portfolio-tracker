import { Component, input, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Sector} from "../../types/Sector";
import { SecurityType } from '../../types/SecurityType';

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

  readonly sectorTypes = Object.values(Sector).map(value => ({ name: value, value }));
  readonly securityTypes = Object.values(SecurityType).map(value => ({ name: value, value }));

  editingSecurity = input<any | null>(null);
  visible = model.required<boolean>();
  form = input.required<FormGroup>();

  confirmed = output<any>();
  cancelled = output<void>();

  onUpdate() {
    this.confirmed.emit(this.form().value);
  }
}