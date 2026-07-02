import { Component } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  imports: [MenuModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  items: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Accounts', icon: 'pi pi-user', routerLink: '/accounts' },
    { label: 'Securities', icon: 'pi pi-lock', routerLink: '/securities' }
  ];
}
