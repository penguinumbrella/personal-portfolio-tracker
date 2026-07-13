import { Component, input, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-modal',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.css',
})
export class UserModal {

  visible = model.required<boolean>();
  recordName = input.required<string>();
  form = input.required<FormGroup>();

  confirmed = output<any>();
  cancelled = output<void>();

  onUpdate() {
    if (this.form().valid) {
      this.confirmed.emit(this.form().value);
    }
  }
}
