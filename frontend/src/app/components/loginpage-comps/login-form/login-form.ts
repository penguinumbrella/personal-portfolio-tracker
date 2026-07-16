import { Component, inject, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/AuthService';

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

  switchToSignup = output<void>();

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  login(): void {
    // Bail out if required fields are missing/invalid
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.form.getRawValue();
    // Call auth API; on success redirect into the app, on failure surface an inline error
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
