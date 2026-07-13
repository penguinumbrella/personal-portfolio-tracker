import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { User } from '../types/User';
import { catchWithMessage } from '../shared/http.util';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly URL = `${environment.baseApiUrl}/users`;
  private readonly authURL = `${environment.baseApiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getCurrentUsername(): Observable<string> {
    return this.http
      .get<string>(`${this.authURL}/username`)
      .pipe(catchWithMessage('Failed to get current username'));
  }

  // overloaded method, get user id by username or call getCurrentUsername()
  getCurrentUserId(username?: string): Observable<number> {
    // get username from gerCurrentUsername() if not provided
    if (!username) {
      let username: string = '';
      this.getCurrentUsername().subscribe((us) => {
        username = us;
      });
    }
    return this.http
      .get<number>(`${this.URL}/id/${username}`)
      .pipe(catchWithMessage('Failed to get user id by username'));
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.URL).pipe(catchWithMessage('Failed to load users'));
  }

  viewProfile(id: number): Observable<User> {
    return this.http.get<User>(`${this.URL}/${id}`).pipe(catchWithMessage('Failed to load user'));
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.URL, user).pipe(catchWithMessage('Failed to create user'));
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http
      .put<User>(`${this.URL}/${id}`, user)
      .pipe(catchWithMessage('Failed to update user'));
  }

  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.URL}/${id}`)
      .pipe(catchWithMessage('Failed to delete user'));
  }
}
