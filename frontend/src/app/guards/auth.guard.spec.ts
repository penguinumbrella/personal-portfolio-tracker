import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of, throwError, isObservable, firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/AuthService';

describe('authGuard', () => {
  const loginUrlTree = { toString: () => '/login' } as UrlTree;

  function setup(mockAuthService: Partial<AuthService>) {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: { parseUrl: () => loginUrlTree } },
      ],
    });
  }

  function runGuard() {
    return TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
  }

  it('allows navigation immediately when a user is already signed in', () => {
    setup({ currentUser: () => ({ id: 1 }) as any });

    const result = runGuard();

    expect(result).toBe(true);
  });

  it('allows navigation once the session is restored from the cookie', async () => {
    setup({
      currentUser: () => null,
      getCurrentUser: () => of({ id: 1 } as any),
    });

    const result = runGuard();
    expect(isObservable(result)).toBe(true);
    await expect(firstValueFrom(result as any)).resolves.toBe(true);
  });

  it('redirects to /login when the session cannot be restored', async () => {
    setup({
      currentUser: () => null,
      getCurrentUser: () => throwError(() => new Error('no session')),
    });

    const result = runGuard();
    await expect(firstValueFrom(result as any)).resolves.toBe(loginUrlTree);
  });
});
