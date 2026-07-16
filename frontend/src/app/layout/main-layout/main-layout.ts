import { Component, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { Menu } from '../../components/menu/menu';
import { ThemeService } from '../../services/ThemeService';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Menu, MatSidenavModule, MatButtonModule, MatIconModule, ToastModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  themeService = inject(ThemeService);
  private router = inject(Router);

  // Toast and Dialog fight over the same dynamic z-index layer and mat-sidenav-container forms
  // its own stacking context around any dialog rendered inside it, so a toast can end up trapped
  // behind an open modal. Moving the toast to be a direct child of <body> sidesteps both issues.
  private toastHost = viewChild.required('toastHost', { read: ElementRef });

  constructor() {
    afterNextRender(() => {
      document.body.appendChild(this.toastHost().nativeElement);
    });
  }

  title = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.getTitle(this.router.routerState.snapshot.root)),
      startWith(this.getTitle(this.router.routerState.snapshot.root))
    ),
    { initialValue: '' }
  );

  private getTitle(route: ActivatedRouteSnapshot): string {
    let current = route;
    let title = '';
    while (current.firstChild) {
      current = current.firstChild;
      title = current.data['title'] ?? title;
    }
    return title;
  }
}
