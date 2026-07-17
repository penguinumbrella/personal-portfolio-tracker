import { Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Holding } from '../../types/Holding';

/**
 * Shared table used on both the account-detail and security-detail pages; the parent page owns
 * the data fetching (and loading state) and just tells this component which mode it's displaying.
 */
@Component({
  selector: 'app-holding-table',
  imports: [
    TableModule,
    Button,
    CurrencyPipe,
    DatePipe,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './holding-table.html',
  styleUrl: './holding-table.css',
})
export class HoldingTable {
  /** The holdings to display. */
  holdings = input<Holding[]>([]);

  /** Controls which columns/labels are shown (grouped by account vs. by security). */
  tableMode = input<'byAccount' | 'bySecurity'>('byAccount');

  /** Emits when the "add holding" action is triggered. */
  onAdd = output<void>();

  /** Emits the holding to edit. */
  onEdit = output<Holding>();

  /** Emits the holding to delete; `originalEvent` lets the parent anchor a confirm popup to the click target. */
  onDelete = output<{ holding: Holding; originalEvent: Event }>();
}
