import { Component, input } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signup-form',
  imports: [
    PasswordModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm {
  signupForm!: FormGroup;
  value: string | undefined;
  email: string | undefined;

  constructor(private formBuilder: FormBuilder) {}

  onInit() {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  triggerSignup() {
    console.log('Signup triggered');
  }

  switchToLogin() {
    console.log('Switching to login form');
  }
}
