import { Component } from '@angular/core';
import { DetailCard } from "../../components/detail-card/detail-card";
import { HoldingTable } from "../../components/holding-table/holding-table";
import { MetricCard } from "../../components/metric-card/metric-card";

@Component({
  selector: 'app-account-detail',
  imports: [DetailCard, HoldingTable, MetricCard],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css',
})
export class AccountDetail {
accounts: any;
onAccountSelect($event: Event) {
throw new Error('Method not implemented.');
}
account: any;
accountMetrics: any;
accountFields: any;
editAccount() {
throw new Error('Method not implemented.');
}
deleteAccount() {
throw new Error('Method not implemented.');
}
holdings: any;
addHolding() {
throw new Error('Method not implemented.');
}
}
