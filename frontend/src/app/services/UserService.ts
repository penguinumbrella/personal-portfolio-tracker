import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { Observable } from "rxjs";
import { User } from "../types/User";
import { catchWithMessage } from "../shared/http.util";

@Injectable({ providedIn: "root" })
export class UserService {
    private readonly URL = `${environment.baseApiUrl}/users`;

    constructor(private http: HttpClient) {}

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.URL)
            .pipe(catchWithMessage("Failed to load users"));
    }

    viewProfile(id: number): Observable<User> {
        return this.http.get<User>(`${this.URL}/${id}`)
            .pipe(catchWithMessage("Failed to load user"));
    }

    updateUser(id: number, user: User): Observable<User> {
        return this.http.put<User>(`${this.URL}/${id}`, user)
            .pipe(catchWithMessage("Failed to update user"));
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.URL}/${id}`)
            .pipe(catchWithMessage("Failed to delete user"));
    }
}
