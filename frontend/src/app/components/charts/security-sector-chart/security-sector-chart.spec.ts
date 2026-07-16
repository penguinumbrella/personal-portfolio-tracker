import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { SecuritySectorChart } from './security-sector-chart';
import { ThemeService } from '../../../services/ThemeService';
import { Sector } from '../../../types/Sector';
import { CHART_PALETTE } from '../pie-chart.utils';
import { describe, it, expect, beforeEach } from 'vitest';

describe('SecuritySectorChart', () => {
  let component: SecuritySectorChart;
  let mockThemeService: { theme: ReturnType<typeof signal<'light' | 'dark'>> };

  beforeEach(() => {
    mockThemeService = { theme: signal('light') };

    TestBed.configureTestingModule({
      imports: [SecuritySectorChart],
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    });

    const fixture = TestBed.createComponent(SecuritySectorChart);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', [
      { sector: Sector.TECHNOLOGY, count: 4 },
      { sector: Sector.ENERGY, count: 0 },
      { sector: Sector.UTILITIES, count: 1 },
    ]);
  });

  it('drops zero-count slices from the chart data', () => {
    expect(component.chartData().labels).toEqual([Sector.TECHNOLOGY, Sector.UTILITIES]);
    expect(component.chartData().datasets[0].data).toEqual([4, 1]);
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
});
