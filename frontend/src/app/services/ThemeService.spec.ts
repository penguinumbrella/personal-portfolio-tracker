import { TestBed } from '@angular/core/testing';
import { ThemeService } from './ThemeService';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('ThemeService', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'my-app-dark');
    vi.restoreAllMocks();
  });

  function mockMatchMedia(matches: boolean) {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches } as MediaQueryList);
  }

  function createService(): ThemeService {
    TestBed.configureTestingModule({ providers: [ThemeService] });
    return TestBed.inject(ThemeService);
  }

  it('resolves the stored theme over the OS preference when one is saved', () => {
    localStorage.setItem('theme', 'light');
    mockMatchMedia(true); // OS says dark, but stored value should win

    const service = createService();

    expect(service.theme()).toBe('light');
  });

  it('falls back to the OS dark preference when nothing is stored', () => {
    mockMatchMedia(true);

    const service = createService();

    expect(service.theme()).toBe('dark');
  });

  it('falls back to light when the OS has no dark preference and nothing is stored', () => {
    mockMatchMedia(false);

    const service = createService();

    expect(service.theme()).toBe('light');
  });

  it('applies the dark classes to the document root on construction', () => {
    mockMatchMedia(true);

    createService();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('my-app-dark')).toBe(true);
  });

  it('toggle() flips between light and dark and persists the change', () => {
    mockMatchMedia(false);
    const service = createService();

    expect(service.theme()).toBe('light');

    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    service.toggle();
    expect(service.theme()).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('setTheme() sets an explicit theme and persists it', () => {
    mockMatchMedia(false);
    const service = createService();

    service.setTheme('dark');

    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
