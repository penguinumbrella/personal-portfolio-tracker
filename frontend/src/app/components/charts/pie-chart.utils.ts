import { Theme } from '../../services/ThemeService';

export const CHART_INK_SECONDARY: Record<Theme, string> = { light: '#52514e', dark: '#c3c2b7' };

/** Drops zero-count slices so the legend/chart never shows empty categories. */
export function filterPositive<T extends { count: number }>(slices: T[]): T[] {
  return slices.filter((slice) => slice.count > 0);
}

/** Dataset/legend styling shared by the pie charts. */
export function buildPieChartDataset(values: number[], colors: string[], mode: Theme) {
  return {
    data: values,
    backgroundColor: colors,
    borderColor: 'transparent',
    borderWidth: 0,
    hoverOffset: 15,
    spacing: 5,     // Adds the gap between segments
    borderRadius: 10 // Rounds the edges
  };
}

export function buildPieChartOptions(mode: Theme) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '40%',
    plugins: {
      legend: {
        position: 'bottom', // Sets the legend to the bottom
        align: 'center',
        labels: {
          color: CHART_INK_SECONDARY[mode],
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
              family: "'Inter', sans-serif"
          }
        },
      },
    },
  };
}
