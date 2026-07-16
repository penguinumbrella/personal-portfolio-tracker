import { Component, computed, inject } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { DashboardStateService } from '../../services/DashboardStateService';
import { UserHandle } from '../user-handle/user-handle';

@Component({
  selector: 'app-menu',
  imports: [PanelMenuModule, RouterModule, UserHandle],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  private dashboardStateService = inject(DashboardStateService);

  items = computed<MenuItem[]>(() => [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Accounts', icon: 'pi pi-user', items: this.buildAccountSubMenu() },
    { label: 'Securities', icon: 'pi pi-lock', items: this.buildSecuritySubMenu() },
  ]);

  // ... is spreader operater. takes array and spreads it to indiv items in array
  buildAccountSubMenu(): MenuItem[] {
    const recentAccounts = this.dashboardStateService.recentAccounts();
    return [
      {
        label: 'See all accounts',
        icon: 'pi pi-list',
        routerLink: '/account',
      },
      { separator: true },
      {
        label: 'Recents',
        disabled: true,
      },
      ...recentAccounts.map((a) => ({
        label: a.nickname,
        icon: 'pi pi-search-plus',
        routerLink: `/account/${a.id}`,
      })),
    ];
  }

  buildSecuritySubMenu(): MenuItem[] {
    const securities = this.dashboardStateService.topSecurities();
    console.log(securities);
    return [
      {
        label: 'See all securities',
        icon: 'pi pi-list',
        routerLink: '/security',
      },
      { separator: true },
      {
        label: 'Top by value',
        disabled: true,
      },
      ...securities.map((s) => ({
        label: s.name,
        icon: 'pi pi-search-plus',
        routerLink: `/security/${s.securityId}`,
      })),
    ];
  }
}
