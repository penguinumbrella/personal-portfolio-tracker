import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-metric-card',
  imports: [CardModule],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.css',
})
export class MetricCard {
  @Input() title: string ='';
  @Input() value: string = '';
  @Input() icon: string = '';


}
