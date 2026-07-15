import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/AuthService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: () => {
        // session is valid, stay on current page
      },
      error: () => {
        // session expired or not logged in
        this.router.navigate(['/login']);
      },
    });
  }
}
