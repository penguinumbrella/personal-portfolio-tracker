import { Component, input, signal } from '@angular/core';
import { CardModule } from 'primeng/card';

/** Card shell that owns carousel navigation (title + index + prev/next) around a projected slide. */
@Component({
  selector: 'app-breakdown-carousel',
  imports: [CardModule],
  templateUrl: './breakdown-carousel.html',
  styleUrl: './breakdown-carousel.css',
})
export class BreakdownCarousel {
  titles = input.required<string[]>();

  activeIndex = signal(0);

  get activeTitle(): string {
    return this.titles()[this.activeIndex()];
  }

  next(): void {
    this.activeIndex.update((i) => (i + 1) % this.titles().length);
  }

  previous(): void {
    this.activeIndex.update((i) => (i - 1 + this.titles().length) % this.titles().length);
  }
}
