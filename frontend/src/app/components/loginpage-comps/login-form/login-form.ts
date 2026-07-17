import { Component, inject, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/AuthService';

/** Login form shown on the signed-out landing page. */
@Component({
  selector: 'app-login-form',
  imports: [PasswordModule, InputTextModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  /** Emits when the user asks to switch to the signup form instead. */
  switchToSignup = output<void>();

  /** Whether a login request is in flight. */
  submitting = signal(false);

  /** The inline error message to show, or `null` if there's none. */
  errorMessage = signal<string | null>(null);

  form = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  /**
   * Submits the login form. Bails out if required fields are missing/invalid; on success
   * redirects into the app, on failure surfaces an inline error.
   */
  login(): void {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.form.getRawValue();
    this.authService.login(username!, password!).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('Invalid username or password.');
      },
    });
  }
}
