import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

/** Describes one column to render: display header + the data field it maps to. */
export interface TableColumn {
  header: string;
  field: string;
}

/** Generic, reusable table card driven entirely by inputs (rows, column config, and a "view more" link). */
@Component({
  selector: 'app-dashboard-table',
  imports: [TableModule, CardModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard-table.html',
  styleUrl: './dashboard-table.css',
})
export class DashboardTable {
  /** The card's title. */
  title = input<string>('');

  /** The rows to display. */
  data = input<any[]>([]);

  /** The columns to render. */
  columns = input<TableColumn[]>([]);

  /** The "view more" link's target route. */
  link = input<string>('');
}
