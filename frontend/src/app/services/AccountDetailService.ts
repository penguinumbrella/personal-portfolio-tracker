import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InvestmentAccount } from "../types/Investment";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "..//..//environments//environments";

@Injectable({providedIn: "root"})
export class AccountDetailService {

    private readonly URL = `${environment.baseApiUrl}/investments`;

    constructor(private http: HttpClient){}
}