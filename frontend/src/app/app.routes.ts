import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { AccountDetail } from './pages/account-detail/account-detail';
import { SecurityDetail } from './pages/security-detail/security-detail';
import { Loginpage } from './pages/loginpage/loginpage';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Loginpage },
  { path: 'dashboard', component: Dashboard },
  { path: 'account', component: AccountDetail },
  { path: 'security', component: SecurityDetail },
  // add account and security detail view
];
