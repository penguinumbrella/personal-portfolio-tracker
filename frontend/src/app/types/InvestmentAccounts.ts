import { InvestmentType } from './InvestmentType';

export interface InvestmentAccount {
  id?: number;

  nickname: string;
  institutionName: string;
  accountType: InvestmentType;
  dateOpened: Date;

  userId?: number;
  totalCost?: number; // total cost of all holdings in this account
}
