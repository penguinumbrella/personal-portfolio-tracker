import { Component, computed, inject, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SecurityType } from '../../../types/SecurityType';
import { ThemeService } from '../../../services/ThemeService';

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

const SURFACE = { light: '#ffffff', dark: '#27272a' };
const INK_SECONDARY = { light: '#52514e', dark: '#c3c2b7' };

@Component({
  selector: 'app-security-type-chart',
  imports: [CardModule, ChartModule],
  templateUrl: './security-type-chart.html',
  styleUrl: './security-type-chart.css',
})
export class SecurityTypeChart {
  private themeService = inject(ThemeService);

  title = input<string>('Securities by Type');
  data = input<SecurityTypeSlice[]>([]);
  previous = output<void>();
  next = output<void>();

  private slices = computed(() => this.data().filter((slice) => slice.count > 0));

  chartData = computed(() => {
    const mode = this.themeService.theme();
    const slices = this.slices();
    return {
      labels: slices.map((slice) => slice.type),
      datasets: [
        {
          data: slices.map((slice) => slice.count),
          backgroundColor: slices.map((slice) => SECURITY_TYPE_COLORS[slice.type][mode]),
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
