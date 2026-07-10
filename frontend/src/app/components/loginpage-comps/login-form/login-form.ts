import { Component } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login-form',
  imports: [PasswordModule, InputTextModule, FormsModule, FloatLabelModule, ButtonModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  value: string | undefined;

  triggerLogin() {
    console.log('Login triggered');
  }

  switchToSignup() {
    console.log('Switching to signup form');
  }
}
