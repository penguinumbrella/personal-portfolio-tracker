import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { catchError, Observable, throwError } from "rxjs";
import { Holding } from "../types/Holding";
import { HoldingId } from "../types/HoldingId";

@Injectable({providedIn: "root"})
export class HoldingService {

    private readonly URL = `${environment.baseApiUrl}/holdings`;

    constructor(private http: HttpClient){}

    getAllHoldingsPerAccount(accountId?: number): Observable<Holding[]> {
        let params = new HttpParams();
    
        if(accountId != null) {
            params = params.set("accountId", accountId);
        }
    
        return this.http.get<Holding[]>(this.URL + `/a`, {params})   
            .pipe(
                catchError(
                    () => throwError(() => new Error("Failed to load Holdings for specified Holding Account."))
                )
            );
    }

    getAllHoldingsPerSecurity(securityId?: number): Observable<Holding[]> {
        let params = new HttpParams();
    
        if(securityId != null) {
            params = params.set("securityId", securityId);
        }
    
        return this.http.get<Holding[]>(this.URL + `/s`, {params})   
            .pipe(
                catchError(
                    () => throwError(() => new Error("Failed to load Holdings for specified Security."))
                )
            );
    }

    createHolding(holding: Holding): Observable<Holding> {
        return this.http.post<Holding>(this.URL, holding)
            .pipe(
                catchError(
                    () => throwError(() => new Error("Failed to create Holding."))
                )
            );
    }

    updateHolding(id: HoldingId, holding: Holding): Observable<Holding> {
        return this.http.put<Holding>(this.URL + `/a` + `/${id.accountId}`+ `/s` + `/${id.securityId}`, holding)
            .pipe(
                catchError(
                    () => throwError(() => new Error("Failed to update Holding."))
                )
            );
    }

    deleteHolding(id: HoldingId): Observable<void> {
        return this.http.delete<void>(this.URL + `/a` + `/${id.accountId}`+ `/s` + `/${id.securityId}`)
            .pipe(
                catchError(
                    () => throwError(() => new Error("Failed to delete Holding."))
                )
            );
    }

    getUserHoldingTotal(userId: number): Observable<number> {
            let params = new HttpParams();
    
            params = params.set("userId", userId);
        
        
            return this.http.get<number>(this.URL + '/total', {params})   
                .pipe(
                    catchError(() => throwError(() => new Error("Failed to load total user holdings.")))
                );
        }
    
        totalInvestedCost(userId: number): Observable<number> {
            let params = new HttpParams();
    
            params = params.set("userId", userId);
        
            return this.http.get<number>(this.URL + '/totalInvestedCost', {params})   
                .pipe(
                    catchError(() => throwError(() => new Error("Failed to load total invested cost for specified User.")))
                );
        }
}