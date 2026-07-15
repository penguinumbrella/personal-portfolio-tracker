import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './AuthService';
import { environment } from '../../environments/environments';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.baseApiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set currentUser signal', () => {
    const mockUser = { id: 1, username: 'testuser' };

    service.login('user', 'pass').subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.currentUser()).toEqual(mockUser);
    });

    // Handle CSRF request
    httpMock.expectOne(`${baseUrl}/csrf`).flush({});

    // Handle Login request
    const loginReq = httpMock.expectOne(`${baseUrl}/login`);
    expect(loginReq.request.method).toBe('POST');
    loginReq.flush(mockUser);
  });

  it('should load current user and update signal', () => {
    const mockUser = { id: 1, username: 'sessionUser' };

    service.getCurrentUser().subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.currentUser()).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${baseUrl}/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should register a new user after CSRF', () => {
    const newUser = { username: 'new' };
    
    service.register(newUser as any).subscribe();

    httpMock.expectOne(`${baseUrl}/csrf`).flush({});
    const regReq = httpMock.expectOne(`${baseUrl}/register`);
    expect(regReq.request.method).toBe('POST');
    regReq.flush(newUser);
  });

  it('should update current user and update signal', () => {
    const updatedUser = { id: 1, username: 'updated' };

    service.updateCurrentUser(updatedUser as any).subscribe(user => {
      expect(user).toEqual(updatedUser);
      expect(service.currentUser()).toEqual(updatedUser);
    });

    httpMock.expectOne(`${baseUrl}/csrf`).flush({});
    const putReq = httpMock.expectOne(`${baseUrl}/me`);
    expect(putReq.request.method).toBe('PUT');
    putReq.flush(updatedUser);
  });

  it('should logout and clear currentUser signal', () => {
    // Set a mock user first
    service.currentUser.set({ id: 1 } as any);

    service.logout().subscribe();

    httpMock.expectOne(`${baseUrl}/csrf`).flush({});
    httpMock.expectOne(`${baseUrl}/logout`).flush({});
    
    expect(service.currentUser()).toBeNull();
  });

  it('should log error if getCurrentUser fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    service.getCurrentUser().subscribe({
      error: (err) => expect(err).toBeTruthy()
    });

    httpMock.expectOne(`${baseUrl}/me`).error(new ProgressEvent('error'), { status: 401 });
    
    expect(consoleSpy).toHaveBeenCalled();
    expect(service.currentUser()).toBeNull();
  });
});