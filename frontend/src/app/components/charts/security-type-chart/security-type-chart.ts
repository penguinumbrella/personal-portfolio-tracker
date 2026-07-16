import { Component, computed, inject, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SecurityType } from '../../../types/SecurityType';
import { ThemeService } from '../../../services/ThemeService';
import { buildPieChartDataset, buildPieChartOptions, filterPositive } from '../pie-chart.utils';

export interface SecurityTypeSlice {
  type: SecurityType;
  count: number;
}

/**
 * Fixed categorical color per security type (never positional) so a type keeps its
 * color even if the user holds none of another type and a slice drops out.
 */
const SECURITY_TYPE_COLORS: Record<SecurityType, { light: string; dark: string }> = {
  [SecurityType.STOCK]: { light: '#2a78d6', dark: '#3987e5' },
  [SecurityType.ETF]: { light: '#008300', dark: '#008300' },
  [SecurityType.MUTUAL_BOND]: { light: '#e87ba4', dark: '#d55181' },
  [SecurityType.BOND]: { light: '#eda100', dark: '#c98500' },
};

@Component({
  selector: 'app-security-type-chart',
  imports: [ChartModule],
  templateUrl: './security-type-chart.html',
  styleUrl: './security-type-chart.css',
})
export class SecurityTypeChart {
  private themeService = inject(ThemeService);

  data = input<SecurityTypeSlice[]>([]);

  private slices = computed(() => filterPositive(this.data()));

  chartData = computed(() => {
    const mode = this.themeService.theme();
    const slices = this.slices();
    return {
      labels: slices.map((slice) => slice.type),
      datasets: [
        buildPieChartDataset(
          slices.map((slice) => slice.count),
          slices.map((slice) => SECURITY_TYPE_COLORS[slice.type][mode]),
          mode,
        ),
      ],
    };
  });

  chartOptions = computed(() => buildPieChartOptions(this.themeService.theme()));
}
