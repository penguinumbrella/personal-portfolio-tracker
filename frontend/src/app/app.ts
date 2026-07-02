import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserHandle } from './components/user-handle/user-handle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Menu } from './components/menu/menu';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserHandle, Menu, MatSidenavModule, MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
