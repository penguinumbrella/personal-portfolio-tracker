import { describe, it, expect } from 'vitest';
import { filterPositive, buildPieChartDataset, buildPieChartOptions, CHART_PALETTE } from './pie-chart.utils';

describe('pie-chart.utils', () => {
  describe('filterPositive()', () => {
    it('drops zero-count slices', () => {
      const slices = [{ count: 0 }, { count: 3 }, { count: 0 }, { count: 1 }];
      expect(filterPositive(slices)).toEqual([{ count: 3 }, { count: 1 }]);
    });

    it('returns an empty array when everything is zero', () => {
      expect(filterPositive([{ count: 0 }])).toEqual([]);
    });

    it('keeps every slice when all are positive', () => {
      const slices = [{ count: 1 }, { count: 2 }];
      expect(filterPositive(slices)).toEqual(slices);
    });
  });

  describe('buildPieChartDataset()', () => {
    it('builds a dataset colored positionally from the shared palette', () => {
      const dataset = buildPieChartDataset([1, 2], 'light');
      expect(dataset).toEqual({
        data: [1, 2],
        backgroundColor: CHART_PALETTE.slice(0, 2),
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 15,
        spacing: 5,
        borderRadius: 10,
      });
    });

    it('colors are the same regardless of theme (palette is not theme-dependent)', () => {
      const light = buildPieChartDataset([1, 2, 3], 'light');
      const dark = buildPieChartDataset([1, 2, 3], 'dark');
      expect(dark.backgroundColor).toEqual(light.backgroundColor);
    });

    it('only uses as many colors as there are values, in palette order', () => {
      const dataset = buildPieChartDataset([1, 2, 3], 'light');
      expect(dataset.backgroundColor).toEqual([CHART_PALETTE[0], CHART_PALETTE[1], CHART_PALETTE[2]]);
    });

    it('does not exceed the palette length when there are more slices than colors', () => {
      const values = Array.from({ length: CHART_PALETTE.length + 2 }, (_, i) => i + 1);
      const dataset = buildPieChartDataset(values, 'light');
      expect(dataset.backgroundColor).toEqual(CHART_PALETTE);
      expect(dataset.backgroundColor.length).toBe(CHART_PALETTE.length);
    });
  });

  describe('buildPieChartOptions()', () => {
    it('builds options with the light-mode legend label color', () => {
      const options = buildPieChartOptions('light');
      expect(options.plugins.legend.labels.color).toBe('#52514e');
      expect(options.responsive).toBe(true);
      expect(options.plugins.legend.position).toBe('bottom');
    });

    it('builds options with the dark-mode legend label color', () => {
      const options = buildPieChartOptions('dark');
      expect(options.plugins.legend.labels.color).toBe('#c3c2b7');
    });
  });
});
