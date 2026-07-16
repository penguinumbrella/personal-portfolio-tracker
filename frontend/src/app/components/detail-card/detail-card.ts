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
// Generic card that renders a title plus a list of label/value fields, with edit/delete actions
// delegated to the parent via outputs (this component holds no edit/delete logic itself)
export class DetailCard {
  fields = input<DetailField[]>([]);

  @Input() title: string = '';
  onEdit = output<void>();
  onDelete = output<void>();
}
