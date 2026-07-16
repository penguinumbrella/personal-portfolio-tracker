import { Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { LoginForm } from '../../components/loginpage-comps/login-form/login-form';
import { SignupForm } from '../../components/loginpage-comps/signup-form/signup-form';

@Component({
  selector: 'app-loginpage',
  imports: [CardModule, LoginForm, SignupForm],
  templateUrl: './loginpage.html',
  styleUrl: './loginpage.css',
})
export class Loginpage {
  // Toggles which form is shown: true = login form, false = signup form.
  loginMode = signal<boolean>(true);
}
