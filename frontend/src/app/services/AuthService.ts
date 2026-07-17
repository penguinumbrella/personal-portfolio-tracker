import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environments";
import { Observable, switchMap, tap } from "rxjs";
import { User } from "../types/User";
import { catchWithMessage } from "../shared/http.util";

/** Handles registration, session-based login/logout, and the signed-in user's own profile. */
@Injectable({ providedIn: "root" })
export class AuthService {
    private http = inject(HttpClient);

    private readonly URL = `${environment.baseApiUrl}/auth`;

    /** The signed-in user for this session, populated by login()/getCurrentUser(). */
    currentUser = signal<User | null>(null);

    /**
     * Seeds the XSRF-TOKEN cookie the backend expects back as a header on state-changing requests.
     *
     * @returns an observable that completes once the CSRF cookie has been set
     */
    private primeCsrfToken(): Observable<unknown> {
        return this.http.get(`${this.URL}/csrf`)
            .pipe(catchWithMessage("Failed to fetch CSRF token"));
    }

    /**
     * Registers a new user account. Primes the CSRF cookie first, then chains into the actual
     * state-changing POST.
     *
     * @param user the new user's details
     * @returns the created user
     */
    register(user: User): Observable<User> {
        return this.primeCsrfToken().pipe(
            switchMap(() => this.http.post<User>(`${this.URL}/register`, user)
                .pipe(catchWithMessage("Failed to create user"))),
        );
    }

    /**
     * Authenticates a user and starts a session. On success, caches the logged-in user for the
     * rest of the app to read via {@link currentUser}.
     *
     * @param username the account's username
     * @param password the account's password
     * @returns the authenticated user's profile
     */
    login(username: string, password: string): Observable<User> {
        return this.primeCsrfToken().pipe(
            switchMap(() => this.http.post<User>(`${this.URL}/login`, { username, password })
                .pipe(catchWithMessage("Failed to log in"))),
            tap((user) => this.currentUser.set(user)),
        );
    }

    /**
     * Fetches the signed-in user from the current session (e.g. after a page reload), keeping
     * {@link currentUser} in sync with whatever the session actually holds.
     *
     * @returns the signed-in user's profile
     */
    getCurrentUser(): Observable<User> {
        return this.http.get<User>(`${this.URL}/me`)
            .pipe(
                catchWithMessage("Failed to load current user"),
                tap((user) => this.currentUser.set(user)),
            );
    }

    /**
     * Updates the signed-in user's own profile, then refreshes {@link currentUser} with the
     * server's updated copy.
     *
     * @param user the updated profile details
     * @returns the updated user profile
     */
    updateCurrentUser(user: User): Observable<User> {
        return this.primeCsrfToken().pipe(
            switchMap(() => this.http.put<User>(`${this.URL}/me`, user)
                .pipe(catchWithMessage("Failed to update user"))),
            tap((updated) => this.currentUser.set(updated)),
        );
    }

    /**
     * Logs out the current session and clears {@link currentUser} so the rest of the app treats
     * the session as signed out.
     *
     * @returns an observable that completes once logout has finished
     */
    logout(): Observable<void> {
        return this.primeCsrfToken().pipe(
            switchMap(() => this.http.post<void>(`${this.URL}/logout`, {})
                .pipe(catchWithMessage("Failed to log out"))),
            tap(() => this.currentUser.set(null)),
        );
    }
}
