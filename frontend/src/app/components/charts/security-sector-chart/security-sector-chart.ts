import { Component, computed, inject, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Sector } from '../../../types/Sector';
import { ThemeService } from '../../../services/ThemeService';
import { buildPieChartDataset, buildPieChartOptions, filterPositive } from '../pie-chart.utils';

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

@Component({
  selector: 'app-security-sector-chart',
  imports: [ChartModule],
  templateUrl: './security-sector-chart.html',
  styleUrl: './security-sector-chart.css',
})
export class SecuritySectorChart {
  private themeService = inject(ThemeService);

  data = input<SectorSlice[]>([]);

  private slices = computed(() => filterPositive(this.data()));

  chartData = computed(() => {
    const mode = this.themeService.theme();
    const slices = this.slices();
    return {
      labels: slices.map((slice) => slice.sector),
      datasets: [
        buildPieChartDataset(
          slices.map((slice) => slice.count),
          slices.map((slice) => SECTOR_COLORS[slice.sector][mode]),
          mode,
        ),
      ],
    };
  });

  chartOptions = computed(() => buildPieChartOptions(this.themeService.theme()));
}
