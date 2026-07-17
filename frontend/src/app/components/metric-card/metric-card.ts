import { Component, input, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CurrencyPipe } from '@angular/common';

/** Simple card for a single metric (title/icon + numeric value, optionally formatted as currency). */
@Component({
  selector: 'app-metric-card',
  imports: [CardModule, CurrencyPipe],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.css',
})
export class MetricCard {
  @Input() title: string ='';
  @Input() icon: string = '';

  /** Whether to render `data` through the currency pipe. */
  @Input() isCurrency: boolean = false;

  /** The metric's value. */
  data = input<number>(0);
}
