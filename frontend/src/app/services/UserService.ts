import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { catchError, Observable, throwError } from "rxjs";
import { User } from "../types/User";


@Injectable({providedIn: "root"})

export class UserService {
    private readonly URL = `${environment.baseApiUrl}/users`

    constructor(private http: HttpClient){}

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.URL)
            .pipe(
                catchError(() => throwError(() => new Error("Failed to load users")))
            );
    }

    viewProfile(id: number): Observable<User> {
        return this.http.get<User>(this.URL + `/${id}`)
            .pipe(
                catchError(() => throwError(() => new Error("Failed to load user")))
            );
    }

    registerUser(user: User): Observable<User> {
        return this.http.post<User>(this.URL, user)
            .pipe(
                    catchError(() => throwError(() => new Error("Failed to create user")))
                );
    }

    updateUser(id: number, user: User): Observable<User> {
        return this.http.put<User>(this.URL + `/${id}`, user)
            .pipe(
                    catchError(() => throwError(() => new Error("Failed to update user")))
                );
    }

    deleteUser(id: number, user: User): Observable<void> {
        return this.http.delete<void>(this.URL + `/${id}`)
            .pipe(
                        catchError(() => throwError(() => new Error("Failed to delete user")))
                    );
    }

}