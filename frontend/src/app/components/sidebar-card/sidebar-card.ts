import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar-card',
  imports: [ButtonModule],
  templateUrl: './sidebar-card.html',
  styleUrl: './sidebar-card.css',
})
export class SidebarCard {
  title = input<string>('');
  data = input<string>('');

  onClick() {
    console.log('Sidebar card clicked:', this.title(), this.data());
  }
}
