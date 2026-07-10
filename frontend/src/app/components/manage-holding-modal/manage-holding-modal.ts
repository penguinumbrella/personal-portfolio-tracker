import { Component, input, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import { IftaLabelModule } from 'primeng/iftalabel';

import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { InvestmentType } from '../../types/InvestmentType';
import { SelectModule } from 'primeng/select';

import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';

import { Security } from '../../types/Security';
import { Holding } from '../../types/Holding';
import { InvestmentAccount } from '../../types/InvestmentAccounts';


@Component({
  selector: 'app-manage-holding-modal',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, FloatLabelModule, InputGroupModule, InputGroupAddonModule
    ,IftaLabelModule, SelectModule, InputNumberModule, DatePickerModule
  ],
  templateUrl: './manage-holding-modal.html',
  styleUrl: './manage-holding-modal.css',
})
export class ManageHoldingModal {

  /**
   * INPUT and OUTPUT
   *    - move data between components
   * 
   *    - input: parent ->  child
   *        - assigning a variable some data     
   * 
   *    - output: child -> parent
   *        - broadcast an event that the parent will need to listen for
   *            - event payload will contain whatever data you want to send to the parent 
   */

  readonly accountOptions = Object.values(InvestmentType).map(value => ({
    name: value,
    value: value
  }));

  // creating values that need to be passed in by the parent

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
    console.log('Form status:', this.form().valid);
    console.log('Form values:', this.form().value);
    
    if (this.form().valid) {
      this.confirmed.emit(this.form().value);
    } else {
      // This logs exactly which fields are broken
      console.log('Form errors:', this.form().errors);
    }
}


}