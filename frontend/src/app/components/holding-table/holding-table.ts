import { Component } from '@angular/core';
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-holding-table',
  imports: [TableModule],
  templateUrl: './holding-table.html',
  styleUrl: './holding-table.css',
})
export class HoldingTable {}
