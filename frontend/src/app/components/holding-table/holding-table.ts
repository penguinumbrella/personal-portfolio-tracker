import { Component, signal } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { Holding } from '../../types/Holding';
import { HoldingService } from '../../services/HoldingService';
import { Button } from "primeng/button";

@Component({
  selector: 'app-holding-table',
  imports: [TableModule, Button],
  templateUrl: './holding-table.html',
  styleUrl: './holding-table.css',
})
export class HoldingTable {

  holdings = signal<Holding[]>([]);
  loading = signal<boolean>(false);

  constructor(
    private holdingService: HoldingService
  ){}


  ngOnInit() {
    this.loadHoldings();
  }

  loadHoldings(event? : TableLazyLoadEvent) {
    
    const page = event ? event?.first! / event?.rows! : 0;
    const size = event ? event?.rows! : 2;

    // show loading spinner while request to backend is being made
    this.loading.set(true);

    // this.holdingService.getHoldingsPage(page, size).subscribe({
    //   next: (data) => {
    //     this.holdings.set(data.content);
    //     this.loading.set(false);
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // })

  }

}
