import { HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { credentialsInterceptor } from './credentials.interceptor';
import { environment } from '../../environments/environments';

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

describe('credentialsInterceptor', () => {
  afterEach(() => {
    clearCookie('XSRF-TOKEN');
  });

  it('passes non-API requests through unchanged', () => {
    const req = new HttpRequest('GET', 'https://some-other-host.com/data');
    const next = vi.fn().mockReturnValue(of({} as any));

    credentialsInterceptor(req, next);

    expect(next).toHaveBeenCalledWith(req);
  });

  it('sets withCredentials on API GET requests without attaching an XSRF header', () => {
    setCookie('XSRF-TOKEN', 'abc123');
    const req = new HttpRequest('GET', `${environment.baseApiUrl}/users`);
    const next = vi.fn().mockReturnValue(of({} as any));

    credentialsInterceptor(req, next);

    const forwarded = next.mock.calls[0][0] as HttpRequest<any>;
    expect(forwarded.withCredentials).toBe(true);
    expect(forwarded.headers.has('X-XSRF-TOKEN')).toBe(false);
  });

  it('attaches the XSRF header from the cookie on mutating API requests', () => {
    setCookie('XSRF-TOKEN', 'abc123');
    const req = new HttpRequest('POST', `${environment.baseApiUrl}/auth/login`, {});
    const next = vi.fn().mockReturnValue(of({} as any));

    credentialsInterceptor(req, next);

    const forwarded = next.mock.calls[0][0] as HttpRequest<any>;
    expect(forwarded.withCredentials).toBe(true);
    expect(forwarded.headers.get('X-XSRF-TOKEN')).toBe('abc123');
  });

  it('does not attach an XSRF header when no cookie is present', () => {
    const req = new HttpRequest('POST', `${environment.baseApiUrl}/auth/login`, {});
    const next = vi.fn().mockReturnValue(of({} as any));

    credentialsInterceptor(req, next);

    const forwarded = next.mock.calls[0][0] as HttpRequest<any>;
    expect(forwarded.headers.has('X-XSRF-TOKEN')).toBe(false);
  });
});
