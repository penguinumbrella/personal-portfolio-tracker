import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { AccountDetail } from './pages/account-detail/account-detail';
import { SecurityDetail } from './pages/security-detail/security-detail';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'account/:accountId', component: AccountDetail },
  { path: 'security/:securityId', component: SecurityDetail },
  // add account and security detail view
];
