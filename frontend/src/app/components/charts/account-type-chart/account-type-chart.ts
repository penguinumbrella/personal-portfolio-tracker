import { Component, computed, inject, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { InvestmentType } from '../../../types/InvestmentType';
import { ThemeService } from '../../../services/ThemeService';
import { buildPieChartDataset, buildPieChartOptions, CHART_INK_SECONDARY, filterPositive } from '../pie-chart.utils';

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

/** Doughnut chart breaking down a user's investment accounts by account type. */
@Component({
  selector: 'app-account-type-chart',
  imports: [ChartModule],
  templateUrl: './account-type-chart.html',
  styleUrl: './account-type-chart.css',
})
export class AccountTypeChart {
  private themeService = inject(ThemeService);

  /** The account-type breakdown to chart. */
  data = input<AccountTypeSlice[]>([]);

  /** The account types with a positive count, dropping empty categories before charting/legend rendering. */
  private slices = computed(() => filterPositive(this.data()));

  /** The doughnut dataset: one slice per account type, re-evaluated when the theme changes. */
  chartData = computed(() => {
    const mode = this.themeService.theme();
    const slices = this.slices();
    return {
      labels: slices.map((slice) => slice.type),
      datasets: [
        buildPieChartDataset(
            slices.map((slice) => slice.count),
            mode,
          ),
      ],
    };
  });

  /** The Chart.js display options for this chart. */
  chartOptions = computed(() => buildPieChartOptions(this.themeService.theme()));
}
