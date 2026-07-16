import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { SecuritySectorChart } from './security-sector-chart';
import { ThemeService } from '../../../services/ThemeService';
import { Sector } from '../../../types/Sector';
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

  it('uses the light-mode color for each sector', () => {
    const colors = component.chartData().datasets[0].backgroundColor;
    expect(colors).toEqual(['#2a78d6', '#2b9b9b']);
  });

  it('switches to dark-mode colors when the theme changes', () => {
    mockThemeService.theme.set('dark');
    const colors = component.chartData().datasets[0].backgroundColor;
    expect(colors).toEqual(['#3987e5', '#3bb5b5']);
  });
});
