import { Component, input, Input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-metric-card',
  imports: [CardModule],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.css',
})
// Simple card for a single metric (title/icon + numeric value)
export class MetricCard {
  title = input<string>('');
  icon = input<string>('');

  data = input<number>(0);
}
