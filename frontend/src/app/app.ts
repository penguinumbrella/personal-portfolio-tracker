import { Component, inject } from '@angular/core';
import { ThemeService } from './services/ThemeService';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/AuthService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private themeService = inject(ThemeService);
}
