import { describe, it, expect } from 'vitest';
import { filterPositive, buildPieChartDataset, buildPieChartOptions } from './pie-chart.utils';

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
    it('builds a dataset with the given values and colors for light mode', () => {
      const dataset = buildPieChartDataset([1, 2], ['#fff', '#000'], 'light');
      expect(dataset).toEqual({
        data: [1, 2],
        backgroundColor: ['#fff', '#000'],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 4,
      });
    });

    it('uses the dark surface color for dark mode', () => {
      const dataset = buildPieChartDataset([1], ['#fff'], 'dark');
      expect(dataset.borderColor).toBe('#27272a');
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
