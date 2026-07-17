import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environments';

const XSRF_COOKIE_NAME = 'XSRF-TOKEN';
const XSRF_HEADER_NAME = 'X-XSRF-TOKEN';

/**
 * Reads a cookie's value by name from `document.cookie`.
 *
 * @param name the cookie's name
 * @returns the cookie's decoded value, or `null` if it isn't set (or there's no `document`, e.g. during SSR)
 */
function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Sends cookies on requests to our API, needed for the CSRF cookie/session handshake, and attaches
 * the XSRF-TOKEN cookie as an X-XSRF-TOKEN header ourselves. Angular's built-in XSRF interceptor
 * refuses to do this automatically for cross-origin requests (our API is on a different port than
 * the app), so without this, mutating requests fail CSRF validation.
 *
 * @param req the outgoing request
 * @param next the next handler in the interceptor chain
 * @returns the response event stream from the (possibly modified) request
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.baseApiUrl)) {
    return next(req);
  }

  let cloned = req.clone({ withCredentials: true });

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const token = readCookie(XSRF_COOKIE_NAME);
    if (token) {
      cloned = cloned.clone({ headers: cloned.headers.set(XSRF_HEADER_NAME, token) });
    }
  }

  return next(cloned);
};
