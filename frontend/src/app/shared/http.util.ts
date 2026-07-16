import { HttpParams } from '@angular/common/http';
import { catchError, OperatorFunction, throwError } from 'rxjs';

/** Wraps any failed HTTP call into a rejection with a fixed, user-facing message. */
export function catchWithMessage<T>(message: string): OperatorFunction<T, T> {
  return catchError((err) => {
    console.error(`[http] ${message} — raw error:`, err, 'status:', err?.status, 'body:', err?.error);
    return throwError(() => err);
  });
}

/** Builds an HttpParams containing just `userId`, for endpoints scoped to the current user. */
export function userIdParams(userId: number): HttpParams {
  return new HttpParams().set('userId', userId);
}

/** Builds an HttpParams for a paginated, searchable endpoint. */
export function pageParams(page: number, size: number, search: string): HttpParams {
  return new HttpParams().set('page', page).set('size', size).set('search', search);
}

/**
 * Extracts a user-facing message from a failed HTTP call.
 * Backend errors are JSON `{ reason: string }` (see GlobalExceptionHandler), but some
 * unhandled exceptions still fall through as a plain-text body — handle both.
 */
export function extractErrorMessage(err: any, fallback: string): string {
  const body = err?.error;
  if (typeof body === 'string' && body.trim()) return body;
  if (body?.reason) return body.reason;
  if (body?.message) return body.message;
  return fallback;
}
