import { HoldingId } from './HoldingId';
import { InvestmentAccount } from './InvestmentAccounts';

export interface Holding {
  account: InvestmentAccount;
  id: HoldingId;
  shares: number;
  costPerShare: number;
  purchaseDate: number;
}
