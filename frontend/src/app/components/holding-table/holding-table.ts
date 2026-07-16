import { Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Holding } from '../../types/Holding';

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
// Shared table used on both the account-detail and security-detail pages; the parent
// page owns the data fetching and just tells this component which mode it's displaying
export class HoldingTable {
  holdings = input<Holding[]>([]);
  // Controls which columns/labels are shown (grouped by account vs. by security)
  tableMode = input<'byAccount' | 'bySecurity'>('byAccount');

  onAdd = output<void>();
  onEdit = output<Holding>();
  // originalEvent is passed through so the parent can anchor a confirm popup to the click target
  onDelete = output<{ holding: Holding; originalEvent: Event }>();

  // Used by two pages to load different data, so they handle loading
}
