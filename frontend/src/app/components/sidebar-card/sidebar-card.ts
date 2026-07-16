import { Component, input } from '@angular/core';

@Component({
  selector: 'app-sidebar-card',
  imports: [],
  templateUrl: './sidebar-card.html',
  styleUrl: './sidebar-card.css',
})
// Presentational card for a single row in the detail sidebar list; highlighting is
// driven entirely by the `selected` input (parent decides which item is active)
export class SidebarCard {
  title = input<string>('');
  data = input<string>('');
  selected = input<boolean>(false);
}
