import { Component, input, Input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';

/** A single label/value field to display in the detail card. */
export interface DetailField {
  label: string;
  value: any;
}

/**
 * Generic card that renders a title plus a list of label/value fields, with edit/delete actions
 * delegated to the parent via outputs (this component holds no edit/delete logic itself).
 */
@Component({
  selector: 'app-detail-card',
  imports: [CardModule, Button],
  templateUrl: './detail-card.html',
  styleUrl: './detail-card.css',
})
export class DetailCard {
  /** The label/value fields to display. */
  fields = input<DetailField[]>([]);

  @Input() title: string = '';

  /** Emits when the edit action is clicked. */
  onEdit = output<void>();

  /** Emits when the delete action is clicked. */
  onDelete = output<void>();
}
