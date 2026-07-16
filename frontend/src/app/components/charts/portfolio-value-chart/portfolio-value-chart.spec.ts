import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { PortfolioValueChart } from './portfolio-value-chart';
import { ThemeService } from '../../../services/ThemeService';
import { describe, it, expect, beforeEach } from 'vitest';

describe('PortfolioValueChart', () => {
  let component: PortfolioValueChart;
  let mockThemeService: { theme: ReturnType<typeof signal<'light' | 'dark'>> };

  const points = [
    { date: '2026-01-01', value: 100 },
    { date: '2026-01-05', value: 150 },
    { date: '2026-01-10', value: 300 },
  ];

  beforeEach(() => {
    mockThemeService = { theme: signal('light') };

    TestBed.configureTestingModule({
      imports: [PortfolioValueChart],
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    });

    const fixture = TestBed.createComponent(PortfolioValueChart);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', points);
  });

  it('defaults to the ALL range, showing every point unmodified', () => {
    expect(component.activeRange()).toBe('ALL');
    expect(component.chartData().labels).toEqual(['2026-01-01', '2026-01-05', '2026-01-10']);
    expect(component.chartData().datasets[0].data).toEqual([100, 150, 300]);
  });

  it('returns an empty series when there are no points, regardless of range', () => {
    const fixture = TestBed.createComponent(PortfolioValueChart);
    fixture.componentRef.setInput('data', []);
    expect(fixture.componentInstance.chartData().labels).toEqual([]);
  });

  it('setRange() narrows the window and carries the prior value forward to the cutoff', () => {
    component.setRange('1W');

    expect(component.activeRange()).toBe('1W');
    // cutoff = last date (01-10) minus 7 days = 01-03, which isn't an exact point,
    // so the last value before it (100, from 01-01) is carried forward to that date.
    expect(component.chartData().labels).toEqual(['2026-01-03', '2026-01-05', '2026-01-10']);
    expect(component.chartData().datasets[0].data).toEqual([100, 150, 300]);
  });

  it('does not carry a value forward when the cutoff has no earlier point', () => {
    const fixture = TestBed.createComponent(PortfolioValueChart);
    fixture.componentRef.setInput('data', [
      { date: '2026-01-09', value: 150 },
      { date: '2026-01-10', value: 300 },
    ]);
    fixture.componentInstance.setRange('1W');

    // cutoff (01-03) predates every point, so there's nothing to carry forward.
    expect(fixture.componentInstance.chartData().labels).toEqual(['2026-01-09', '2026-01-10']);
  });

  it('formats tooltip values as currency', () => {
    const label = component.chartOptions().plugins.tooltip.callbacks.label({ parsed: { y: 1234.5 } } as any);
    expect(label).toBe('$1,234.50');
  });

  it('formats y-axis ticks as compact currency with no decimals', () => {
    const formatted = component.chartOptions().scales.y.ticks.callback(1200);
    expect(formatted).toBe('$1,200');
  });

  it('uses the theme-appropriate line color', () => {
    expect(component.chartData().datasets[0].borderColor).toBe('#2a78d6');
    mockThemeService.theme.set('dark');
    expect(component.chartData().datasets[0].borderColor).toBe('#3987e5');
  });
});
