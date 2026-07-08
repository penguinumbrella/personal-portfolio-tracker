import { HoldingId } from './HoldingId';
import { InvestmentAccount } from './InvestmentAccounts';
import { Security } from './Security';

export interface Holding {
  id?: HoldingId;
  a_id?: number;
  s_id?: number;
  shares: number;
  costPerShare: number;
  purchaseDate: number;
  account?: InvestmentAccount;
  security?: Security;
}
