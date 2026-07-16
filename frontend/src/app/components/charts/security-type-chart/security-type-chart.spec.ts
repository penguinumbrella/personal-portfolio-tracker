import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { SecurityTypeChart } from './security-type-chart';
import { ThemeService } from '../../../services/ThemeService';
import { SecurityType } from '../../../types/SecurityType';
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

  it('uses the light-mode color for each security type', () => {
    const colors = component.chartData().datasets[0].backgroundColor;
    expect(colors).toEqual(['#2a78d6', '#eda100']);
  });

  it('switches to dark-mode colors when the theme changes', () => {
    mockThemeService.theme.set('dark');
    const colors = component.chartData().datasets[0].backgroundColor;
    expect(colors).toEqual(['#3987e5', '#c98500']);
  });

  it('sets the surface-colored border matching the current theme', () => {
    expect(component.chartData().datasets[0].borderColor).toBe('#ffffff');
    mockThemeService.theme.set('dark');
    expect(component.chartData().datasets[0].borderColor).toBe('#27272a');
  });
});
