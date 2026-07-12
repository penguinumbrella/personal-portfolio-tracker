import { Component, Input, Output, EventEmitter, input, output } from '@angular/core';
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
export class HoldingTable {
  holdings = input<Holding[]>([]);
  tableMode = input<'byAccount' | 'bySecurity'>('byAccount');

  onAdd = output<void>();
  onEdit = output<Holding>();
  onDelete = output<{ holding: Holding, originalEvent: Event }>();

  // Used by two pages to load different data, so they handle loading
}
