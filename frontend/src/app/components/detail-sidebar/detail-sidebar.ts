import { Component, output, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarCard } from '../sidebar-card/sidebar-card';
import { ButtonModule } from 'primeng/button';

// Layout for the sidebar cards
export interface SidebarItem {
  id: number;
  label: string;
  subtitle: string;
}

@Component({
  selector: 'app-detail-sidebar',
  imports: [NgClass, ScrollPanelModule, SidebarCard, ButtonModule],
  templateUrl: './detail-sidebar.html',
  styleUrl: './detail-sidebar.css',
})
export class DetailSidebar {
  items = input<SidebarItem[]>([]);

  addLabel = input<string>('Add Item'); 
  

  selectedId = signal<number | null>(null);

  selected = output<SidebarItem>();

  onAddItem = output<void>();


  onSelect(item: SidebarItem): void {
    this.selectedId.set(item.id);
    this.selected.emit(item);
  }

  onAddClick(): void {
    this.onAddItem.emit();
  }

}
