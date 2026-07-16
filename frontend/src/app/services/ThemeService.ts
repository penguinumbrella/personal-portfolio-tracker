import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    theme = signal<Theme>(this.resolveInitialTheme());

    constructor() {
        // Apply the resolved theme to the DOM on startup, but only in the browser (SSR has no document).
        if (this.isBrowser) {
            this.applyTheme(this.theme());
        }
    }

    toggle(): void {
        this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
    }

    setTheme(theme: Theme): void {
        this.theme.set(theme);
        if (this.isBrowser) {
            // Persist the choice so it survives reloads, then reflect it in the DOM immediately.
            localStorage.setItem(STORAGE_KEY, theme);
            this.applyTheme(theme);
        }
    }

    private resolveInitialTheme(): Theme {
        // No DOM/localStorage during SSR; default to dark.
        if (!this.isBrowser) return 'dark';

        // Prefer a previously saved user choice...
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') return stored;

        // ...otherwise fall back to the OS/browser color-scheme preference.
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /** Toggles both Tailwind's class strategy and PrimeNG's darkModeSelector, which use different class names. Both go on <html> since it's an ancestor of everything PrimeNG themes. */
    private applyTheme(theme: Theme): void {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('my-app-dark', isDark);
    }
}
