import { Component, output, input, signal, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarCard } from '../sidebar-card/sidebar-card';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

/** Layout for the sidebar cards shown on the account-detail and security-detail pages. */
export interface SidebarItem {
  id: number;
  label: string;
  subtitle: string;
}

/**
 * Searchable, paginated sidebar list used on the account-detail and security-detail pages.
 * The parent page owns data fetching; this component just renders items and emits selection,
 * search, paging, and "add" events.
 */
@Component({
  selector: 'app-detail-sidebar',
  imports: [NgClass, ScrollPanelModule, SidebarCard, ButtonModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './detail-sidebar.html',
  styleUrl: './detail-sidebar.css',
})
export class DetailSidebar implements OnDestroy {
  /** The items to list. */
  items = input<SidebarItem[]>([]);

  /** Label for the "add" button. */
  addLabel = input<string>('Add Item');

  /** Current page index (0-based) and total page count, for the pager footer. */
  page = input<number>(0);
  totalPages = input<number>(1);

  /** The locally-selected item's id, for styling the active row. */
  selectedId = signal<number | null>(null);

  /** Emits the selected item when a row is clicked. */
  selected = output<SidebarItem>();

  /** Emits when the "add" button is clicked. */
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

  /** Cleans up the search subject's subscription when the component is destroyed. */
  ngOnDestroy(): void {
    this.searchInput$.complete();
  }

  /**
   * Tracks the locally-selected item for styling, and notifies the parent of the selection.
   *
   * @param item the selected sidebar item
   */
  onSelect(item: SidebarItem): void {
    this.selectedId.set(item.id);
    this.selected.emit(item);
  }

  /** Notifies the parent that the "add" button was clicked. */
  onAddClick(): void {
    this.onAddItem.emit();
  }

  /**
   * Pushes raw search input into the debounce pipeline set up in the constructor.
   *
   * @param value the raw search input value
   */
  onSearchInput(value: string): void {
    this.searchInput$.next(value);
  }

  /** Goes to the previous page, guarding against paging before the first page. */
  onPrevPage(): void {
    if (this.page() > 0) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  /** Goes to the next page, guarding against paging past the last page. */
  onNextPage(): void {
    if (this.page() < this.totalPages() - 1) {
      this.pageChange.emit(this.page() + 1);
    }
  }
}
