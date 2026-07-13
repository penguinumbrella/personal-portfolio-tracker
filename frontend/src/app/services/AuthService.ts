import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environments";
import { Observable, switchMap, tap } from "rxjs";
import { User } from "../types/User";
import { catchWithMessage } from "../shared/http.util";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly URL = `${environment.baseApiUrl}/auth`;

    /** The signed-in user for this session, populated by login()/getCurrentUser(). */
    currentUser = signal<User | null>(null);

    constructor(private http: HttpClient) {}

    /** Seeds the XSRF-TOKEN cookie the backend expects back as a header on state-changing requests. */
    private primeCsrfToken(): Observable<unknown> {
        return this.http.get(`${this.URL}/csrf`)
            .pipe(catchWithMessage("Failed to fetch CSRF token"));
    }

    register(user: User): Observable<User> {
        return this.primeCsrfToken().pipe(
            switchMap(() => this.http.post<User>(`${this.URL}/register`, user)
                .pipe(catchWithMessage("Failed to create user"))),
        );
    }

    login(username: string, password: string): Observable<User> {
        return this.primeCsrfToken().pipe(
            switchMap(() => this.http.post<User>(`${this.URL}/login`, { username, password })
                .pipe(catchWithMessage("Failed to log in"))),
            tap((user) => this.currentUser.set(user)),
        );
    }

    /** Fetches the signed-in user from the current session (e.g. after a page reload). */
    getCurrentUser(): Observable<User> {
        return this.http.get<User>(`${this.URL}/me`)
            .pipe(
                catchWithMessage("Failed to load current user"),
                tap((user) => this.currentUser.set(user)),
            );
    }

    updateCurrentUser(user: User): Observable<User> {
        return this.primeCsrfToken().pipe(
            switchMap(() => this.http.put<User>(`${this.URL}/me`, user)
                .pipe(catchWithMessage("Failed to update user"))),
            tap((updated) => this.currentUser.set(updated)),
        );
    }

    logout(): Observable<void> {
        return this.primeCsrfToken().pipe(
            switchMap(() => this.http.post<void>(`${this.URL}/logout`, {})
                .pipe(catchWithMessage("Failed to log out"))),
            tap(() => this.currentUser.set(null)),
        );
    }
}
