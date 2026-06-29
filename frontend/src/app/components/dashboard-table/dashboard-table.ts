import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard-table',
  imports: [TableModule, CardModule],
  templateUrl: './dashboard-table.html',
  styleUrl: './dashboard-table.css',
})
export class DashboardTable {
  @Input() title: string = '';
  @Input() data: any[] = [];
}
