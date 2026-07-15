import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserHandle } from '../../components/user-handle/user-handle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Menu } from '../../components/menu/menu';
import { ThemeService } from '../../services/ThemeService';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, UserHandle, Menu, MatSidenavModule, MatButtonModule, MatIconModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  themeService = inject(ThemeService);
}
