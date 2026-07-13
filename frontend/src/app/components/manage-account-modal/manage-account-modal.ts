import { Component, input, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InvestmentType } from '../../types/InvestmentType';

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

  readonly accountTypes = Object.values(InvestmentType).map(value => ({
    name: value,
    value: value
  }));

  editingAccount = input<any | null>(null);
  visible = model.required<boolean>();
  form = input.required<FormGroup>();

  confirmed = output<any>();
  cancelled = output<void>();

  onUpdate() {
    this.confirmed.emit(this.form().value);
  }
}