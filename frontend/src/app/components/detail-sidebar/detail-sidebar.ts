import { Component, output, input, signal } from '@angular/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarCard } from '../sidebar-card/sidebar-card';

// Layout for the sidebar cards
export interface SidebarItem {
  id: number;
  label: string;
  subtitle: string;
}

@Component({
  selector: 'app-detail-sidebar',
  imports: [ScrollPanelModule, SidebarCard],
  templateUrl: './detail-sidebar.html',
  styleUrl: './detail-sidebar.css',
})
export class DetailSidebar {
  items = input<SidebarItem[]>([]);
  selectedId = signal<number | null>(null);

  selected = output<SidebarItem>();

  onSelect(item: SidebarItem): void {
    this.selectedId.set(item.id);
    this.selected.emit(item);
  }
}
