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

@Component({
  selector: 'app-manage-account-modal',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    IftaLabelModule,
    SelectModule,
  ],
  templateUrl: './manage-account-modal.html',
  styleUrl: './manage-account-modal.css',
})
export class ManageAccountModal {
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

  readonly accountOptions = Object.values(InvestmentType).map((value) => ({
    name: value,
    value: value,
  }));

  // creating values that need to be passed in by the parent
  visible = model.required<boolean>();
  recordName = input.required<string>();
  form = input.required<FormGroup>();

  // creating events for when the deletion is confirmed or cancelled - needs to be handled by parent
  confirmed = output<any>();
  cancelled = output<void>();

  onUpdate() {
    this.confirmed.emit(this.form().value);
    this.visible.set(false); // Close the modal
  }
}
