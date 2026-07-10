import { Component, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { LoginForm } from '../../components/loginpage-comps/login-form/login-form';
import { SignupForm } from '../../components/loginpage-comps/signup-form/signup-form';

@Component({
  selector: 'app-loginpage',
  imports: [DividerModule, CardModule, LoginForm, SignupForm],
  templateUrl: './loginpage.html',
  styleUrl: './loginpage.css',
})
export class Loginpage {
  loginMode = signal<boolean>(true);
}
