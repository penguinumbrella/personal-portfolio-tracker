import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AccountTypeChart } from './account-type-chart';
import { ThemeService } from '../../../services/ThemeService';
import { InvestmentType } from '../../../types/InvestmentType';
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

  it('uses the light-mode color for each account type', () => {
    const colors = component.chartData().datasets[0].backgroundColor;
    expect(colors).toEqual(['#2a78d6', '#7a5cd6']);
  });

  it('switches to dark-mode colors when the theme changes', () => {
    mockThemeService.theme.set('dark');
    const colors = component.chartData().datasets[0].backgroundColor;
    expect(colors).toEqual(['#3987e5', '#8f74e0']);
  });

  it('builds chart options with the current theme legend color', () => {
    expect(component.chartOptions().plugins.legend.labels.color).toBe('#52514e');
    mockThemeService.theme.set('dark');
    expect(component.chartOptions().plugins.legend.labels.color).toBe('#c3c2b7');
  });
});
