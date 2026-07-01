import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { catchError, Observable, throwError } from "rxjs";
import { Security } from "../types/Security";

@Injectable({providedIn: "root"})
export class SecurityService {

    private readonly URL = `${environment.baseApiUrl}/securities`;

    constructor(private http: HttpClient){}

    getAllSecuritiesByUser(userId?: number): Observable<Security[]> {
        let params = new HttpParams();

        if(userId != null) {
            params = params.set("userId", userId);
        }
    
        return this.http.get<Security[]>(this.URL + '/u', {params})   
            .pipe(
                catchError(() => throwError(() => new Error("Failed to load Securities for specified User.")))
            );
    }

    createSecurity(security: Security): Observable<Security> {
        return this.http.post<Security>(this.URL, security)
            .pipe(
                catchError(() => throwError(() => new Error("Failed to create Security.")))
            );
    }

    updateSecurity(id: number, security: Security): Observable<Security> {
        return this.http.put<Security>(this.URL + `/${id}`, security)
            .pipe(
                catchError(() => throwError(() => new Error("Failed to update Security.")))
            );
    }

    deleteSecurity(id: number): Observable<void> {
        return this.http.delete<void>(this.URL  + `/${id}`)
            .pipe(
                catchError(() => throwError(() => new Error("Failed to delete Security.")))
            );
    }

    getUserSecurityTotal(userId: number): Observable<number> {
        let params = new HttpParams();

        params = params.set("userId", userId);
    
    
        return this.http.get<number>(this.URL + '/total', {params})   
            .pipe(
                catchError(() => throwError(() => new Error("Failed to load total user securities.")))
            );
    }

    getRecentSecurities(userId: number): Observable<Security[]> {
        let params = new HttpParams();

        params = params.set("userId", userId);
    
        return this.http.get<Security[]>(this.URL + '/recent', {params})   
            .pipe(
                catchError(() => throwError(() => new Error("Failed to load recent Securities for specified User.")))
            );
    }
}