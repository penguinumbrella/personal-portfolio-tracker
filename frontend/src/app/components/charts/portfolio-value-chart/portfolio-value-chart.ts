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

/**
 * Normalizes API date values to `yyyy-MM-dd`. Jackson may serialize `java.sql.Date` as a full
 * ISO timestamp (e.g. `2026-01-15T00:00:00.000+00:00`); the chart expects a date-only key.
 *
 * @param date a `yyyy-MM-dd` string, ISO datetime, epoch millis, or Date from the API
 * @returns the date portion as `yyyy-MM-dd`
 */
function toDateKey(date: string | number | Date): string {
  if (date instanceof Date) {
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, '0'),
      String(date.getUTCDate()).padStart(2, '0'),
    ].join('-');
  }

  if (typeof date === 'number') {
    return toDateKey(new Date(date));
  }

  const raw = String(date);
  // Prefer slicing the leading calendar date so ISO timestamps don't need Date parsing.
  const leading = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (leading) {
    return leading[1];
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }
  return toDateKey(parsed);
}

/**
 * Parses an ISO `yyyy-MM-dd` date string using local date parts. `new Date(dateStr)` reads the
 * string as UTC midnight, which can roll back a day once formatted in a west-of-UTC timezone.
 *
 * @param dateStr the date string, in `yyyy-MM-dd` format
 * @returns the parsed date, at local midnight
 */
function parseISODate(dateStr: string): Date {
  const [year, month, day] = toDateKey(dateStr).split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Formats a date key for chart axis/tooltip display (e.g. `Jan 15`). */
function formatDayLabel(dateStr: string): string {
  return DAY_FORMATTER.format(parseISODate(dateStr));
}

/** Line chart of a user's cumulative portfolio value over time, with selectable date ranges. */
@Component({
  selector: 'app-portfolio-value-chart',
  imports: [CardModule, ChartModule],
  templateUrl: './portfolio-value-chart.html',
  styleUrl: './portfolio-value-chart.css',
})
export class PortfolioValueChart {
  private themeService = inject(ThemeService);

  /** The chart's card title. */
  title = input<string>('Portfolio Value Over Time');

  /** The full, unfiltered portfolio value history to chart. */
  data = input<PortfolioValuePoint[]>([]);

  /** The selectable date range options rendered as buttons. */
  rangeOptions = RANGE_OPTIONS;

  /** The currently selected date range filter. */
  activeRange = signal<RangeKey>('ALL');

  /**
   * Switches the active time-range filter (1W/1M/1Y/All) applied to the series.
   *
   * @param range the range to switch to
   */
  setRange(range: RangeKey): void {
    this.activeRange.set(range);
  }

  /**
   * Builds a top-to-bottom fade (theme-tinted color -> transparent) used as the area fill under
   * the line. Must run inside a Chart.js `backgroundColor` callback because it needs the live
   * canvas ctx/chartArea.
   *
   * @param ctx the chart's canvas rendering context
   * @param chartArea the chart's plotted area, used to size the gradient
   * @param mode the current theme, used to tint the gradient
   * @returns a linear gradient fading from the theme-tinted color to transparent
   */
  private createGradient(ctx: CanvasRenderingContext2D, chartArea: any, mode: 'light' | 'dark') {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    const color = mode === 'light' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(253, 224, 71, 0.3)';
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    return gradient;
  }

  /**
   * The line dataset built from the range-filtered points, with a gradient fill recomputed
   * per-render (`backgroundColor` callback) and per theme.
   */
  chartData = computed(() => {
    const mode = this.themeService.theme();
    const points = this.filteredPoints();
    return {
      // Short labels go on the chart itself so axis ticks and tooltips never show ISO timestamps.
      labels: points.map((point) => formatDayLabel(point.date)),
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

  /**
   * The Chart.js display options: hides the legend (single series), formats tooltips/axis ticks
   * as currency, and styles axes/gridlines per theme.
   */
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

  /**
   * The portfolio value points within {@link activeRange}. The underlying series only has a
   * point on dates a purchase happened, so a range window is anchored to the most recent point
   * and carries the prior cumulative value forward to the cutoff, otherwise the line would
   * falsely dip to zero.
   */
  private filteredPoints = computed(() => {
    // Normalize dates so range filters and tick labels always use yyyy-MM-dd keys.
    const points = this.data().map((point) => ({
      ...point,
      date: toDateKey(point.date),
    }));
    const range = this.activeRange();
    const days = RANGE_DAYS[range];
    // 'ALL' (no day count) or no data: show everything, unfiltered.
    if (!days || points.length === 0) {
      return points;
    }

    // Cutoff date = N days back from the latest data point (not from "today").
    const cutoff = parseISODate(points[points.length - 1].date);
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffKey = [
      cutoff.getFullYear(),
      String(cutoff.getMonth() + 1).padStart(2, '0'),
      String(cutoff.getDate()).padStart(2, '0'),
    ].join('-');

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
