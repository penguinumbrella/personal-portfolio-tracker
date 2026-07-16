import { Component, computed, inject, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { InvestmentType } from '../../../types/InvestmentType';
import { ThemeService } from '../../../services/ThemeService';

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

const SURFACE = { light: '#ffffff', dark: '#27272a' };
const INK_SECONDARY = { light: '#52514e', dark: '#c3c2b7' };

@Component({
  selector: 'app-account-type-chart',
  imports: [CardModule, ChartModule],
  templateUrl: './account-type-chart.html',
  styleUrl: './account-type-chart.css',
})
export class AccountTypeChart {
  private themeService = inject(ThemeService);

  title = input<string>('Accounts by Type');
  data = input<AccountTypeSlice[]>([]);
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
          backgroundColor: slices.map((slice) => ACCOUNT_TYPE_COLORS[slice.type][mode]),
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
