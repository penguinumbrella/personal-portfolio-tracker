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

  // Advance to the next slide, wrapping back to the first after the last.
  next(): void {
    this.activeIndex.update((i) => (i + 1) % this.titles().length);
  }

  // Go to the previous slide, wrapping to the last slide from the first
  // (the `+ length` avoids a negative index before the modulo).
  previous(): void {
    this.activeIndex.update((i) => (i - 1 + this.titles().length) % this.titles().length);
  }
}
