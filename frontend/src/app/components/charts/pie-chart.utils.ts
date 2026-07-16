import { Theme } from '../../services/ThemeService';

export const CHART_SURFACE: Record<Theme, string> = { light: '#ffffff', dark: '#27272a' };
export const CHART_INK_SECONDARY: Record<Theme, string> = { light: '#52514e', dark: '#c3c2b7' };

/** Drops zero-count slices so the legend/chart never shows empty categories. */
export function filterPositive<T extends { count: number }>(slices: T[]): T[] {
  return slices.filter((slice) => slice.count > 0);
}

/** Dataset/legend styling shared by the simple (non-doughnut) pie charts. */
export function buildPieChartDataset(values: number[], colors: string[], mode: Theme) {
  return {
    data: values,
    backgroundColor: colors,
    borderColor: CHART_SURFACE[mode],
    borderWidth: 2,
    hoverOffset: 4,
  };
}

export function buildPieChartOptions(mode: Theme) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: CHART_INK_SECONDARY[mode] },
      },
    },
  };
}
