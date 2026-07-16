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

@Component({
  selector: 'app-account-type-chart',
  imports: [ChartModule],
  templateUrl: './account-type-chart.html',
  styleUrl: './account-type-chart.css',
})
export class AccountTypeChart {
  private themeService = inject(ThemeService);

  data = input<AccountTypeSlice[]>([]);

  private slices = computed(() => filterPositive(this.data()));

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


  chartOptions = computed(() => buildPieChartOptions(this.themeService.theme()));
}