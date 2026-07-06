import { User } from './User';
import { Sector } from './Sector';
import { SecurityType } from './SecurityType';

export interface Security {
  id?: number;

  tickerSymbol: string;
  name: string;
  sector: Sector;
  securityType: SecurityType;
  generalNotes: string;
}
