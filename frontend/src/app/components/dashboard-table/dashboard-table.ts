import { Component, input, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

export interface TableColumn {
  header: string;
  field: string;
}

@Component({
  selector: 'app-dashboard-table',
  imports: [TableModule, CardModule],
  templateUrl: './dashboard-table.html',
  styleUrl: './dashboard-table.css',
})
export class DashboardTable {
  @Input() title: string = '';
  data = input<any[]>([]);
  columns = input<TableColumn[]>([]);
}
