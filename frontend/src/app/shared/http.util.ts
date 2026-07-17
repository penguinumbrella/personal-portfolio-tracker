import { HttpParams } from '@angular/common/http';
import { catchError, OperatorFunction, throwError } from 'rxjs';

/**
 * Wraps any failed HTTP call into a rejection with a fixed, user-facing message.
 *
 * @param message the message to log alongside the raw error
 * @returns an RxJS operator that logs and rethrows the original error
 */
export function catchWithMessage<T>(message: string): OperatorFunction<T, T> {
  return catchError((err) => {
    console.error(`[http] ${message} — raw error:`, err, 'status:', err?.status, 'body:', err?.error);
    return throwError(() => err);
  });
}

/**
 * Builds an HttpParams containing just `userId`, for endpoints scoped to the current user.
 *
 * @param userId the user's id
 * @returns the request params
 */
export function userIdParams(userId: number): HttpParams {
  return new HttpParams().set('userId', userId);
}

/**
 * Builds an HttpParams for a paginated, searchable endpoint.
 *
 * @param page the zero-based page number
 * @param size the page size
 * @param search the search term
 * @returns the request params
 */
export function pageParams(page: number, size: number, search: string): HttpParams {
  return new HttpParams().set('page', page).set('size', size).set('search', search);
}

/**
 * Extracts a user-facing message from a failed HTTP call.
 * Backend errors are JSON `{ reason: string }` (see GlobalExceptionHandler), but some
 * unhandled exceptions still fall through as a plain-text body — handle both.
 *
 * @param err the raw error thrown by the HTTP call
 * @param fallback the message to use if no usable message can be extracted from `err`
 * @returns the extracted or fallback user-facing message
 */
export function extractErrorMessage(err: any, fallback: string): string {
  const body = err?.error;
  if (typeof body === 'string' && body.trim()) return body;
  if (body?.reason) return body.reason;
  if (body?.message) return body.message;
  return fallback;
}
