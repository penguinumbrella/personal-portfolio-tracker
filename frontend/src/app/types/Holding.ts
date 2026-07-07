import { HoldingId } from './HoldingId';
import { InvestmentAccount } from './InvestmentAccounts';
import { Security } from './Security';

export interface Holding {
  security: Security;
  account: InvestmentAccount;
  id: HoldingId;
  shares: number;
  costPerShare: number;
  purchaseDate: number;
}
