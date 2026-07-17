import { Component, input } from '@angular/core';

/**
 * Presentational card for a single row in the detail sidebar list; highlighting is driven
 * entirely by the `selected` input (the parent decides which item is active).
 */
@Component({
  selector: 'app-sidebar-card',
  imports: [],
  templateUrl: './sidebar-card.html',
  styleUrl: './sidebar-card.css',
})
export class SidebarCard {
  /** The row's title. */
  title = input<string>('');

  /** The row's subtitle/data text. */
  data = input<string>('');

  /** Whether this row is the currently active/selected one. */
  selected = input<boolean>(false);
}
