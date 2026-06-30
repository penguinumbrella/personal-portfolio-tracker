import { HoldingId } from "./HoldingId";

export interface Holding {
    id: HoldingId;

    numShares: number;
    costPerShare: number;
    purchaseDate: number;    
    
}