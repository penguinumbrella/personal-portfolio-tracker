import { Component, input, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  imports: [CardModule, CurrencyPipe],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.css',
})
export class MetricCard {
  @Input() title: string ='';
  //@Input() value: string = '';
  @Input() icon: string = '';
  @Input() isCurrency: boolean = false;

  data = input<number>(0);


}
