import { Component, inject, output, signal } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/AuthService';

/** Signup form shown on the signed-out landing page. */
@Component({
  selector: 'app-signup-form',
  imports: [PasswordModule, InputTextModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  /** Emits when the user asks to switch to the login form instead. */
  switchToLogin = output<void>();

  /** Whether a registration request is in flight. */
  submitting = signal(false);

  /** The inline error message to show, or `null` if there's none. */
  errorMessage = signal<string | null>(null);

  form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /**
   * Registers a new user. Bails out if required fields are missing/invalid; on success hands
   * control back to the login form, on failure surfaces an inline error.
   */
  signup(): void {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    const { username, email, password } = this.form.getRawValue();
    this.authService
      .register({ username: username!, email: email!, passwordHash: password! })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.switchToLogin.emit();
        },
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set('Failed to create account. Please try again.');
        },
      });
  }
}
