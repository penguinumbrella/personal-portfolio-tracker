import { Component, inject } from '@angular/core';
<<<<<<< HEAD
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/ThemeService';
=======
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/AuthService';
>>>>>>> 8bcb5fb87a75418c9f11476365922f80ef3e3192

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
