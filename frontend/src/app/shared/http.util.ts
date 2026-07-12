import { HttpParams } from '@angular/common/http';
import { catchError, OperatorFunction, throwError } from 'rxjs';

/** Wraps any failed HTTP call into a rejection with a fixed, user-facing message. */
export function catchWithMessage<T>(message: string): OperatorFunction<T, T> {
  return catchError(() => throwError(() => new Error(message)));
}

/** Builds an HttpParams containing just `userId`, for endpoints scoped to the current user. */
export function userIdParams(userId: number): HttpParams {
  return new HttpParams().set('userId', userId);
}
