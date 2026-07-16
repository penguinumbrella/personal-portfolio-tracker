import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// Describes one column to render: display header + the data field it maps to
export interface TableColumn {
  header: string;
  field: string;
}

@Component({
  selector: 'app-dashboard-table',
  imports: [TableModule, CardModule, CurrencyPipe, RouterLink],
  templateUrl: './dashboard-table.html',
  styleUrl: './dashboard-table.css',
})
// Generic, reusable table card driven entirely by inputs (rows, column config, and a "view more" link)
export class DashboardTable {
  title = input<string>('');
  data = input<any[]>([]);
  columns = input<TableColumn[]>([]);
  link = input<string>('');
}
