import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AccountTypeChart } from './account-type-chart';
import { ThemeService } from '../../../services/ThemeService';
import { InvestmentType } from '../../../types/InvestmentType';
import { CHART_PALETTE } from '../pie-chart.utils';
import { describe, it, expect, beforeEach } from 'vitest';

describe('AccountTypeChart', () => {
  let component: AccountTypeChart;
  let mockThemeService: { theme: ReturnType<typeof signal<'light' | 'dark'>> };

  beforeEach(() => {
    mockThemeService = { theme: signal('light') };

    TestBed.configureTestingModule({
      imports: [AccountTypeChart],
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    });

    const fixture = TestBed.createComponent(AccountTypeChart);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', [
      { type: InvestmentType.BROKERAGE, count: 3 },
      { type: InvestmentType.ROTH_IRA, count: 0 },
      { type: InvestmentType.HSA, count: 1 },
    ]);
  });

  it('drops zero-count slices from the chart data', () => {
    expect(component.chartData().labels).toEqual([InvestmentType.BROKERAGE, InvestmentType.HSA]);
    expect(component.chartData().datasets[0].data).toEqual([3, 1]);
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

  it('builds chart options with the current theme legend color', () => {
    expect(component.chartOptions().plugins.legend.labels.color).toBe('#52514e');
    mockThemeService.theme.set('dark');
    expect(component.chartOptions().plugins.legend.labels.color).toBe('#c3c2b7');
  });
});
