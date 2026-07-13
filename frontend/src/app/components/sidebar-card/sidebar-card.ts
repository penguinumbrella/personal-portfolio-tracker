import { Component, input } from '@angular/core';

@Component({
  selector: 'app-sidebar-card',
  imports: [],
  templateUrl: './sidebar-card.html',
  styleUrl: './sidebar-card.css',
})
export class SidebarCard {
  title = input<string>('');
  data = input<string>('');
  selected = input<boolean>(false);
}
