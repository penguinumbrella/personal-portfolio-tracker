import { Theme } from '../../services/ThemeService';

export const CHART_INK_SECONDARY: Record<Theme, string> = { light: '#52514e', dark: '#c3c2b7' };

export const CHART_PALETTE = [
  '#FF5256', // Saturated Red
  '#FFD433', // Saturated Yellow
  '#7ED957', // Saturated Green
  '#359BE3', // Saturated Blue
  '#9B72E1'  // Saturated Lavender
];

/**
 * Drops zero-count slices so the legend/chart never shows empty categories.
 *
 * @param slices the slices to filter
 * @returns only the slices with a positive count
 */
export function filterPositive<T extends { count: number }>(slices: T[]): T[] {
  return slices.filter((slice) => slice.count > 0);
}

/**
 * Builds the dataset/legend styling shared by the pie charts, coloring slices positionally from
 * {@link CHART_PALETTE}.
 *
 * @param values the value for each slice
 * @param mode the current theme (accepted for a consistent signature with other chart builders;
 *        the palette itself isn't theme-dependent)
 * @returns a Chart.js dataset object
 */
export function buildPieChartDataset(values: number[], mode: Theme) {
  return {
    data: values,
    backgroundColor: CHART_PALETTE.slice(0, values.length),
    borderColor: 'transparent',
    borderWidth: 0,
    hoverOffset: 15,
    spacing: 5, // Adds the gap between segments
    borderRadius: 10, // Rounds the edges
  };
}

/** Fixed pixel radius so the arc stays a consistent size regardless of how many legend rows wrap. */
const PIE_CHART_RADIUS = 120;

/**
 * Builds the Chart.js display options shared by the pie charts.
 *
 * @param mode the current theme, used to color the legend labels
 * @returns a Chart.js options object
 */
export function buildPieChartOptions(mode: Theme) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '40%',
    radius: PIE_CHART_RADIUS,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          color: CHART_INK_SECONDARY[mode],
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            family: "'Inter', sans-serif",
            size: 11, // Adjust this value to your preference (e.g., 10, 11, or 12),
            weight: 'bold'
          }
        },
      },
    },
  };
}