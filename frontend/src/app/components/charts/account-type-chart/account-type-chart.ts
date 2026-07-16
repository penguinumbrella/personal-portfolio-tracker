import { Component, computed, inject, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { InvestmentType } from '../../../types/InvestmentType';
import { ThemeService } from '../../../services/ThemeService';
import { CHART_INK_SECONDARY, filterPositive } from '../pie-chart.utils';

export interface AccountTypeSlice {
  type: InvestmentType;
  count: number;
}

/**
 * Fixed categorical color per account type (never positional) so a type keeps its
 * color even if the user holds none of another type and a slice drops out.
 */
const ACCOUNT_TYPE_COLORS: Record<InvestmentType, { light: string; dark: string }> = {
  [InvestmentType.BROKERAGE]: { light: '#2a78d6', dark: '#3987e5' },
  [InvestmentType.TRADITIONAL_IRA]: { light: '#008300', dark: '#008300' },
  [InvestmentType.ROTH_IRA]: { light: '#e87ba4', dark: '#d55181' },
  [InvestmentType.K401]: { light: '#eda100', dark: '#c98500' },
  [InvestmentType.HSA]: { light: '#7a5cd6', dark: '#8f74e0' },
};

@Component({
  selector: 'app-account-type-chart',
  imports: [ChartModule],
  templateUrl: './account-type-chart.html',
  styleUrl: './account-type-chart.css',
})
export class AccountTypeChart {
  private themeService = inject(ThemeService);

  data = input<AccountTypeSlice[]>([]);

  // Drop zero-count account types before charting/legend rendering.
  private slices = computed(() => filterPositive(this.data()));

  // Builds the doughnut dataset: one slice per account type, colored by the
  // fixed per-type palette (re-evaluated when the theme changes).
  chartData = computed(() => {
    const mode = this.themeService.theme();
    const slices = this.slices();
    return {
      labels: slices.map((slice) => slice.type),
      datasets: [
        {
          data: slices.map((slice) => slice.count),
          backgroundColor: slices.map((slice) => ACCOUNT_TYPE_COLORS[slice.type][mode]),
          borderColor: 'transparent',
          borderWidth: 0,
          hoverOffset: 15,
          spacing: 5,     // Adds the gap between segments
          borderRadius: 10 // Rounds the edges
        },
      ],
    };
  });

  // Chart.js display options: doughnut cutout size and bottom legend styling,
  // recomputed whenever the theme changes so legend text stays legible.
  chartOptions = computed(() => {
    const mode = this.themeService.theme();
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '40%',
      plugins: {
        legend: {
          position: 'bottom', // Sets the legend to the bottom
          align: 'center',
          labels: {
            color: CHART_INK_SECONDARY[mode],
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 25,
            font: {
                size: 14,
                family: "'Inter', sans-serif"
            }
          },
        },
      },
    };
  });
}
