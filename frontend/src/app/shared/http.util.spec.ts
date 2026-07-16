import { describe, it, expect, vi } from 'vitest';
import { catchWithMessage, userIdParams, pageParams, extractErrorMessage } from './http.util';
import { of, throwError, firstValueFrom } from 'rxjs';

describe('http.util', () => {
  describe('userIdParams()', () => {
    it('builds params containing just userId', () => {
      const params = userIdParams(42);
      expect(params.get('userId')).toBe('42');
    });
  });

  describe('pageParams()', () => {
    it('builds params for page, size, and search', () => {
      const params = pageParams(1, 20, 'apple');
      expect(params.get('page')).toBe('1');
      expect(params.get('size')).toBe('20');
      expect(params.get('search')).toBe('apple');
    });
  });

  describe('catchWithMessage()', () => {
    it('passes through successful values unchanged', async () => {
      const result = await firstValueFrom(of(5).pipe(catchWithMessage('should not fire')));
      expect(result).toBe(5);
    });

    it('rethrows the original error after logging', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const originalError = { status: 404 };

      await expect(
        firstValueFrom(throwError(() => originalError).pipe(catchWithMessage('failed to load'))),
      ).rejects.toBe(originalError);

      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });
  });

  describe('extractErrorMessage()', () => {
    it('returns a plain-text error body directly', () => {
      const message = extractErrorMessage({ error: 'Something broke' }, 'fallback');
      expect(message).toBe('Something broke');
    });

    it('returns the reason field from a JSON error body', () => {
      const message = extractErrorMessage({ error: { reason: 'Username taken' } }, 'fallback');
      expect(message).toBe('Username taken');
    });

    it('returns the message field when reason is absent', () => {
      const message = extractErrorMessage({ error: { message: 'Bad request' } }, 'fallback');
      expect(message).toBe('Bad request');
    });

    it('falls back when the body has neither reason nor message', () => {
      const message = extractErrorMessage({ error: {} }, 'fallback');
      expect(message).toBe('fallback');
    });

    it('falls back when there is no error body at all', () => {
      const message = extractErrorMessage({}, 'fallback');
      expect(message).toBe('fallback');
    });

    it('falls back when the plain-text body is blank', () => {
      const message = extractErrorMessage({ error: '   ' }, 'fallback');
      expect(message).toBe('fallback');
    });
  });
});
