import { Component, input, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

/** Edit-profile modal shown from the user handle. */
@Component({
  selector: 'app-user-modal',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.css',
})
export class UserModal {

  /** Whether the modal is visible. */
  visible = model.required<boolean>();

  /** The display name shown in the modal title. */
  recordName = input.required<string>();

  /** The reactive form backing the modal's fields. */
  form = input.required<FormGroup>();

  /** Emits the form's value when confirmed and valid; the parent owns persistence. */
  confirmed = output<any>();

  /** Emits when the modal is cancelled/closed without confirming. */
  cancelled = output<void>();

  /** Emits when the user logs out from within the modal. */
  loggedOut = output<void>();

  /** Emits the form's value if it passes validation; the parent owns persistence. */
  onUpdate() {
    if (this.form().valid) {
      this.confirmed.emit(this.form().value);
    }
  }
}
