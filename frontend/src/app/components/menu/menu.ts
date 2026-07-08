import { Component } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [MenuModule, RouterModule, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  items: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Accounts', icon: 'pi pi-user', routerLink: '/account' },
    { label: 'Securities', icon: 'pi pi-lock', routerLink: '/security' },
  ];
}
