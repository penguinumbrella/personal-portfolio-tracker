import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './UserService';
import { environment } from '../../environments/environments';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.baseApiUrl}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all users', () => {
    const mockUsers = [{ id: 1, username: 'plswork', email: 'plswork@test.com', passwordHash: '' }];
    service.getAllUsers().subscribe((data) => {
      expect(data).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should view a profile by id', () => {
    const mockUser = { id: 1, username: 'plswork', email: 'plswork@test.com', passwordHash: '' };
    service.viewProfile(1).subscribe((data) => {
      expect(data).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should update a user', () => {
    const payload = { username: 'diff', email: 'diff@test.com', passwordHash: 'diff' };
    service.updateUser(1, payload as any).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('should delete a user', () => {
    service.deleteUser(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
