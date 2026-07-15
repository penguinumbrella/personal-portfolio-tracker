import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { AccountDetail } from './pages/account-detail/account-detail';
import { SecurityDetail } from './pages/security-detail/security-detail';
import { Loginpage } from './pages/loginpage/loginpage';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: Loginpage },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'account', component: AccountDetail },
      { path: 'security', component: SecurityDetail },
    ],
  },
];
