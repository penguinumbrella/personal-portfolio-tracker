import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { Observable } from "rxjs";
import { User } from "../types/User";
import { catchWithMessage } from "../shared/http.util";

/** HTTP client for administering user accounts. */
@Injectable({ providedIn: "root" })
export class UserService {
    private http = inject(HttpClient);

    private readonly URL = `${environment.baseApiUrl}/users`;

    /**
     * Fetches every user account, for admin-style listings.
     *
     * @returns all users
     */
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.URL)
            .pipe(catchWithMessage("Failed to load users"));
    }

    /**
     * Fetches a single user's profile by id.
     *
     * @param id the user's id
     * @returns the matching user profile
     */
    viewProfile(id: number): Observable<User> {
        return this.http.get<User>(`${this.URL}/${id}`)
            .pipe(catchWithMessage("Failed to load user"));
    }

    /**
     * Updates a user's profile.
     *
     * @param id the user's id
     * @param user the updated profile details
     * @returns the updated user profile
     */
    updateUser(id: number, user: User): Observable<User> {
        return this.http.put<User>(`${this.URL}/${id}`, user)
            .pipe(catchWithMessage("Failed to update user"));
    }

    /**
     * Deletes a user account.
     *
     * @param id the user's id
     * @returns an observable that completes once the user has been deleted
     */
    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.URL}/${id}`)
            .pipe(catchWithMessage("Failed to delete user"));
    }
}
