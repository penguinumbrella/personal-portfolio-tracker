import { Component, input, Input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';

// helper interface for the fields to display in the detail card
export interface DetailField {
  label: string;
  value: any;
}

@Component({
  selector: 'app-detail-card',
  imports: [CardModule, Button],
  templateUrl: './detail-card.html',
  styleUrl: './detail-card.css',
})
export class DetailCard {
  fields = input<DetailField[]>([]);

  @Input() title: string = '';
  onEdit = output<void>();
  onDelete = output<void>();
}
