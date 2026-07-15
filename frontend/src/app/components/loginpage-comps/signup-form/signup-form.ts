import { Component, inject, output, signal } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/AuthService';

@Component({
  selector: 'app-signup-form',
  imports: [PasswordModule, InputTextModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  switchToLogin = output<void>();

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

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
