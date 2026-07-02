import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { catchError, Observable, throwError } from "rxjs";
import { InvestmentAccount } from "../types/InvestmentAccounts";


@Injectable({providedIn: "root"})
export class InvestmentAccountService {

    /**
     * SERVICES
     *      - handle the business logic of your application
     *      - primarilly used for logic that will be reused across components
     * 
     *      - biggest example: HTTP requests
     *          - one central location for all your related requests
     */

    private readonly URL = `${environment.baseApiUrl}/investments`;


    constructor(private http: HttpClient){}

    getAllInvestmentAccounts(userId?: number): Observable<InvestmentAccount[]> {
        let params = new HttpParams();

        // set the rating param if a value was given
        if(userId != null) {
            params = params.set("userId", userId);
        }

        return this.http.get<InvestmentAccount[]>(this.URL, {params})
            

            .pipe(

                catchError(
                    () => throwError(
                        () => new Error("Failed to load InvestmentAccounts.")
                    )
                )
            );
    }

    createInvestmentAccount(investmentAccount: InvestmentAccount): Observable<InvestmentAccount> {
        return this.http.post<InvestmentAccount>(this.URL, investmentAccount)
            .pipe(
                catchError(
                    () => throwError(
                        () => new Error("Failed to create InvestmentAccount.")
                    )
                )
            );
    }


    updateInvestmentAccount(id: number, investmentAccount: InvestmentAccount): Observable<InvestmentAccount> {
        return this.http.put<InvestmentAccount>(this.URL + `/${id}`, investmentAccount)
            .pipe(
                catchError(
                    () => throwError(
                        () => new Error("Failed to update InvestmentAccount.")
                    )
                )
            );
    }

    deleteInvestmentAccount(id: number): Observable<void> {
        return this.http.delete<void>(this.URL + `/${id}`)
            .pipe(
                catchError(
                    () => throwError(
                        () => new Error("Failed to delete InvestmentAccount.")
                    )
                )
            );
    }

    getUserInvestmentAccountTotal(userId: number): Observable<number> {
        let params = new HttpParams();
        params = params.set("userId", userId);
        return this.http.get<number>(this.URL + `/total`, {params})
            

            .pipe(

                catchError(
                    () => throwError(
                        () => new Error("Failed to load total count of a user's investment accounts.")
                    )
                )
            );
    }

    getRecentAccounts(userId: number): Observable<InvestmentAccount[]> {
        let params = new HttpParams();
        params = params.set("userId", userId);
        return this.http.get<InvestmentAccount[]>(this.URL + `/recent`, {params})
            

            .pipe(

                catchError(
                    () => throwError(
                        () => new Error("Failed to load user's recent investment accounts.")
                    )
                )
            );
    }

}