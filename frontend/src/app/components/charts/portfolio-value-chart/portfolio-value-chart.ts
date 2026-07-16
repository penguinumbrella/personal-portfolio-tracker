import { Component, computed, inject, input, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ThemeService } from '../../../services/ThemeService';

export interface PortfolioValuePoint {
  date: string;
  value: number;
}

type RangeKey = '1W' | '1M' | '1Y' | 'ALL';

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: '1W', label: '1W' },
  { key: '1M', label: '1M' },
  { key: '1Y', label: '1Y' },
  { key: 'ALL', label: 'All' },
];

const RANGE_DAYS: Partial<Record<RangeKey, number>> = { '1W': 7, '1M': 30, '1Y': 365 };

const LINE_COLOR = { light: '#2a78d6', dark: '#3987e5' };
const FILL_COLOR = { light: 'rgba(42, 120, 214, 0.12)', dark: 'rgba(57, 135, 229, 0.16)' };
const GRID_COLOR = { light: '#e5e7eb', dark: '#3f3f46' };
const INK_SECONDARY = { light: '#52514e', dark: '#c3c2b7' };

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const CURRENCY_FORMATTER_COMPACT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

@Component({
  selector: 'app-portfolio-value-chart',
  imports: [CardModule, ChartModule],
  templateUrl: './portfolio-value-chart.html',
  styleUrl: './portfolio-value-chart.css',
})
export class PortfolioValueChart {
  private themeService = inject(ThemeService);
  
  // Need reference to chart to update gradients
  private chartRef: any; 

  title = input<string>('Portfolio Value Over Time');
  data = input<PortfolioValuePoint[]>([]);

  rangeOptions = RANGE_OPTIONS;
  activeRange = signal<RangeKey>('ALL');

  setRange(range: RangeKey): void {
    this.activeRange.set(range);
  }

  // Refactored to include gradient creation
  private createGradient(ctx: CanvasRenderingContext2D, chartArea: any, mode: 'light' | 'dark') {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    const color = mode === 'light' ? 'rgba(42, 120, 214, 0.3)' : 'rgba(57, 135, 229, 0.3)';
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    return gradient;
  }

  chartData = computed(() => {
    const mode = this.themeService.theme();
    const points = this.filteredPoints();
    return {
      labels: points.map((point) => point.date),
      datasets: [
        {
          label: 'Total Invested',
          data: points.map((point) => point.value),
          borderColor: LINE_COLOR[mode],
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            return this.createGradient(ctx, chartArea, mode);
          },
          fill: true,
          tension: 0.4, // Smoother curve
          pointRadius: 2,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: LINE_COLOR[mode],
          pointHoverBorderWidth: 2,
        },
      ],
    };
  });

  chartOptions = computed(() => {
    const mode = this.themeService.theme();
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1000, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context: any) => CURRENCY_FORMATTER.format(context.parsed.y),
          },
        },
      },
      scales: {
        x: { ticks: { color: INK_SECONDARY[mode] }, grid: { display: false } },
        y: {
          ticks: {
            color: INK_SECONDARY[mode],
            callback: (value: number) => CURRENCY_FORMATTER_COMPACT.format(value),
          },
          grid: { color: GRID_COLOR[mode] },
        },
      },
    };
  });

  // The underlying series only has a point on dates a purchase happened, so a range
  // window is anchored to the most recent point and carries the prior cumulative
  // value forward to the cutoff, otherwise the line would falsely dip to zero.
  private filteredPoints = computed(() => {
    const points = this.data();
    const range = this.activeRange();
    const days = RANGE_DAYS[range];
    if (!days || points.length === 0) {
      return points;
    }

    const cutoff = new Date(points[points.length - 1].date);
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffKey = cutoff.toISOString().slice(0, 10);

    const before = points.filter((point) => point.date < cutoffKey);
    const within = points.filter((point) => point.date >= cutoffKey);
    const carriedValue = before.length > 0 ? before[before.length - 1].value : 0;

    if (before.length === 0) {
      return within;
    }
    if (within.length > 0 && within[0].date === cutoffKey) {
      return within;
    }
    return [{ date: cutoffKey, value: carriedValue }, ...within];
  });

}
