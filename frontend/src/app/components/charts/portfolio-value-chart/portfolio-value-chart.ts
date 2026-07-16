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

const LINE_COLOR = { light: '#eab308', dark: '#fde047' };
const FILL_COLOR = { light: 'rgba(234, 179, 8, 0.12)', dark: 'rgba(253, 224, 71, 0.16)' };
const GRID_COLOR = { light: '#e5e7eb', dark: '#3f3f46' };
const INK_SECONDARY = { light: '#52514e', dark: '#c3c2b7' };

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const CURRENCY_FORMATTER_COMPACT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const DAY_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

// "2024-01-15" parsed via `new Date()` is read as UTC midnight, which can roll back
// a day once formatted in a west-of-UTC timezone. Build the date from local parts instead.
function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

@Component({
  selector: 'app-portfolio-value-chart',
  imports: [CardModule, ChartModule],
  templateUrl: './portfolio-value-chart.html',
  styleUrl: './portfolio-value-chart.css',
})
export class PortfolioValueChart {
  private themeService = inject(ThemeService);

  title = input<string>('Portfolio Value Over Time');
  data = input<PortfolioValuePoint[]>([]);

  rangeOptions = RANGE_OPTIONS;
  activeRange = signal<RangeKey>('ALL');

  // Switches the active time-range filter (1W/1M/1Y/All) applied to the series.
  setRange(range: RangeKey): void {
    this.activeRange.set(range);
  }

  // Refactored to include gradient creation
  // Builds a top-to-bottom fade (theme-tinted color -> transparent) used as the
  // area fill under the line; must run inside a Chart.js backgroundColor callback
  // because it needs the live canvas ctx/chartArea.
  private createGradient(ctx: CanvasRenderingContext2D, chartArea: any, mode: 'light' | 'dark') {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    const color = mode === 'light' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(253, 224, 71, 0.3)';
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    return gradient;
  }

  // Builds the line dataset from the range-filtered points, with a gradient
  // fill recomputed per-render (backgroundColor callback) and per theme.
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
            // chartArea isn't available until the chart has done its first layout pass.
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

  // Chart.js display options: hides the legend (single series), formats
  // tooltips/axis ticks as currency, and styles axes/gridlines per theme.
  chartOptions = computed(() => {
    const mode = this.themeService.theme();
    const points = this.filteredPoints();
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1000, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          // Full currency format (e.g. $1,234.56) in the hover tooltip.
          callbacks: {
            label: (context: any) => CURRENCY_FORMATTER.format(context.parsed.y),
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: INK_SECONDARY[mode],
            autoSkip: true,
            maxTicksLimit: 8,
            maxRotation: 0,
            callback: (value: number, index: number) => {
              const point = points[index];
              return point ? DAY_FORMATTER.format(parseISODate(point.date)) : '';
            },
          },
          grid: { display: false },
        },
        y: {
          ticks: {
            color: INK_SECONDARY[mode],
            // Compact currency format (no cents) for y-axis tick labels.
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
    // 'ALL' (no day count) or no data: show everything, unfiltered.
    if (!days || points.length === 0) {
      return points;
    }

    // Cutoff date = N days back from the latest data point (not from "today").
    const cutoff = new Date(points[points.length - 1].date);
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffKey = cutoff.toISOString().slice(0, 10);

    const before = points.filter((point) => point.date < cutoffKey);
    const within = points.filter((point) => point.date >= cutoffKey);
    // Last known value before the window starts, used to seed the window's start.
    const carriedValue = before.length > 0 ? before[before.length - 1].value : 0;

    if (before.length === 0) {
      return within;
    }
    // Already have a point exactly at the cutoff date; no need to synthesize one.
    if (within.length > 0 && within[0].date === cutoffKey) {
      return within;
    }
    // Prepend a synthetic point at the cutoff carrying the prior value forward.
    return [{ date: cutoffKey, value: carriedValue }, ...within];
  });
}
