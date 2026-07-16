import { Component, computed, inject, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Sector } from '../../../types/Sector';
import { ThemeService } from '../../../services/ThemeService';

export interface SectorSlice {
  sector: Sector;
  count: number;
}

/**
 * Fixed categorical color per sector (never positional) so a sector keeps its
 * color even if the user holds none of another sector and a slice drops out.
 */
const SECTOR_COLORS: Record<Sector, { light: string; dark: string }> = {
  [Sector.TECHNOLOGY]: { light: '#2a78d6', dark: '#3987e5' },
  [Sector.HEALTHCARE]: { light: '#008300', dark: '#008300' },
  [Sector.FINANCIALS]: { light: '#e87ba4', dark: '#d55181' },
  [Sector.CONSUMER]: { light: '#eda100', dark: '#c98500' },
  [Sector.ENERGY]: { light: '#c4432b', dark: '#d9583f' },
  [Sector.INDUSTRIALS]: { light: '#7a5cd6', dark: '#8f74e0' },
  [Sector.UTILITIES]: { light: '#2b9b9b', dark: '#3bb5b5' },
  [Sector.REAL_ESTATE]: { light: '#8a8a29', dark: '#a3a334' },
};

const SURFACE = { light: '#ffffff', dark: '#27272a' };
const INK_SECONDARY = { light: '#52514e', dark: '#c3c2b7' };

@Component({
  selector: 'app-security-sector-chart',
  imports: [CardModule, ChartModule],
  templateUrl: './security-sector-chart.html',
  styleUrl: './security-sector-chart.css',
})
export class SecuritySectorChart {
  private themeService = inject(ThemeService);

  title = input<string>('Securities by Sector');
  data = input<SectorSlice[]>([]);
  previous = output<void>();
  next = output<void>();

  private slices = computed(() => this.data().filter((slice) => slice.count > 0));

  chartData = computed(() => {
    const mode = this.themeService.theme();
    const slices = this.slices();
    return {
      labels: slices.map((slice) => slice.sector),
      datasets: [
        {
          data: slices.map((slice) => slice.count),
          backgroundColor: slices.map((slice) => SECTOR_COLORS[slice.sector][mode]),
          borderColor: SURFACE[mode],
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  });

  chartOptions = computed(() => {
    const mode = this.themeService.theme();
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: INK_SECONDARY[mode] },
        },
      },
    };
  });
}
