import { Component, output, input, signal, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarCard } from '../sidebar-card/sidebar-card';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

// Layout for the sidebar cards
export interface SidebarItem {
  id: number;
  label: string;
  subtitle: string;
}

@Component({
  selector: 'app-detail-sidebar',
  imports: [NgClass, ScrollPanelModule, SidebarCard, ButtonModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './detail-sidebar.html',
  styleUrl: './detail-sidebar.css',
})
export class DetailSidebar implements OnDestroy {
  items = input<SidebarItem[]>([]);

  addLabel = input<string>('Add Item');

  /** Current page index (0-based) and total page count, for the pager footer. */
  page = input<number>(0);
  totalPages = input<number>(1);

  selectedId = signal<number | null>(null);

  selected = output<SidebarItem>();
  onAddItem = output<void>();

  /** Debounced (300ms) search text as the user types. */
  searchChange = output<string>();
  /** Emits the next page index when Prev/Next is clicked. */
  pageChange = output<number>();

  private searchInput$ = new Subject<string>();

  constructor() {
    // Pipe raw keystrokes through a debounce + distinct filter so searchChange only
    // fires 300ms after typing stops, and only when the term actually changed
    this.searchInput$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
      this.searchChange.emit(term);
    });
  }

  ngOnDestroy(): void {
    // Clean up the subject's subscription when the component is destroyed
    this.searchInput$.complete();
  }

  onSelect(item: SidebarItem): void {
    // Track locally-selected item for styling, and notify parent of the selection
    this.selectedId.set(item.id);
    this.selected.emit(item);
  }

  onAddClick(): void {
    this.onAddItem.emit();
  }

  onSearchInput(value: string): void {
    // Push raw input into the debounce pipeline set up in the constructor
    this.searchInput$.next(value);
  }

  onPrevPage(): void {
    // Guard against paging before the first page
    if (this.page() > 0) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  onNextPage(): void {
    // Guard against paging past the last page
    if (this.page() < this.totalPages() - 1) {
      this.pageChange.emit(this.page() + 1);
    }
  }
}
