import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-user-modal',
  imports: [DialogModule, ButtonModule],
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
  visible = input.required<boolean>();
  recordName = input.required<string>();
  

  // creating events for when the deletion is confirmed or cancelled - needs to be handled by parent
  confirmed = output<void>();
  cancelled = output<void>();


  /**
   * IF YOU NEEDED TO SET A PAYLOD, HERE'S AN EXAMPLE
   */
  handleEvent() {
    let payload = {}

    //eventName.emit(payload);
  }


}