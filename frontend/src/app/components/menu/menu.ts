import { Component, computed, inject } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { DashboardStateService } from '../../services/DashboardStateService';
import { UserHandle } from '../user-handle/user-handle';

/** Side navigation: dashboard/accounts/securities links, submenus fed by dashboard state, and the user handle. */
@Component({
  selector: 'app-menu',
  imports: [PanelMenuModule, RouterModule, UserHandle],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  private dashboardStateService = inject(DashboardStateService);

  /**
   * The full nav tree, recomputed whenever the underlying dashboard state (recent accounts /
   * top securities) changes, since those feed the submenu builders below.
   */
  items = computed<MenuItem[]>(() => [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Accounts', icon: 'pi pi-user', items: this.buildAccountSubMenu() },
    { label: 'Securities', icon: 'pi pi-lock', items: this.buildSecuritySubMenu() },
  ]);

  /**
   * Builds the "Accounts" submenu: static links plus a dynamic list of recently viewed accounts.
   *
   * @returns the accounts submenu items
   */
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

  /**
   * Builds the "Securities" submenu: static links plus the top securities by value.
   *
   * @returns the securities submenu items
   */
  buildSecuritySubMenu(): MenuItem[] {
    const securities = this.dashboardStateService.topSecurities();
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
