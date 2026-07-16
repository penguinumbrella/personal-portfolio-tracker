import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { SecurityTypeChart } from './security-type-chart';
import { ThemeService } from '../../../services/ThemeService';
import { SecurityType } from '../../../types/SecurityType';
import { CHART_PALETTE } from '../pie-chart.utils';
import { describe, it, expect, beforeEach } from 'vitest';

describe('SecurityTypeChart', () => {
  let component: SecurityTypeChart;
  let mockThemeService: { theme: ReturnType<typeof signal<'light' | 'dark'>> };

  beforeEach(() => {
    mockThemeService = { theme: signal('light') };

    TestBed.configureTestingModule({
      imports: [SecurityTypeChart],
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    });

    const fixture = TestBed.createComponent(SecurityTypeChart);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', [
      { type: SecurityType.STOCK, count: 5 },
      { type: SecurityType.ETF, count: 0 },
      { type: SecurityType.BOND, count: 2 },
    ]);
  });

  it('drops zero-count slices from the chart data', () => {
    expect(component.chartData().labels).toEqual([SecurityType.STOCK, SecurityType.BOND]);
    expect(component.chartData().datasets[0].data).toEqual([5, 2]);
  });

  it('colors slices positionally from the shared palette', () => {
    const colors = component.chartData().datasets[0].backgroundColor;
    expect(colors).toEqual(CHART_PALETTE.slice(0, 2));
  });

  it('keeps the same colors when the theme changes (palette is not theme-dependent)', () => {
    const lightColors = component.chartData().datasets[0].backgroundColor;
    mockThemeService.theme.set('dark');
    const darkColors = component.chartData().datasets[0].backgroundColor;
    expect(darkColors).toEqual(lightColors);
  });

  it('has a transparent border regardless of theme', () => {
    expect(component.chartData().datasets[0].borderColor).toBe('transparent');
    mockThemeService.theme.set('dark');
    expect(component.chartData().datasets[0].borderColor).toBe('transparent');
  });
});
