import { Component, input, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import { IftaLabelModule } from 'primeng/iftalabel';

import { ReactiveFormsModule, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-user-modal',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, FloatLabelModule, InputGroupModule, InputGroupAddonModule
    ,IftaLabelModule
  ],
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.css',
})
export class UserModal {

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

  // creating values that need to be passed in by the parent
  visible = model.required<boolean>();
  recordName = input.required<string>();
  form = input.required<FormGroup>();
  

  // creating events for when the deletion is confirmed or cancelled - needs to be handled by parent
  confirmed = output<any>();
  cancelled = output<void>();

  onUpdate() {
    // .value gives you the object { username: '...', email: '...' }
    this.confirmed.emit(this.form().value);
    this.visible.set(false); // Close the modal
  }


  /**
   * IF YOU NEEDED TO SET A PAYLOD, HERE'S AN EXAMPLE
   */
  handleEvent() {
    let payload = {}

    //eventName.emit(payload);
  }


}