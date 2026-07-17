import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** Resolves, persists, and toggles the app's light/dark theme, syncing it to the DOM. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    /** The current theme, initially resolved from localStorage or the OS color-scheme preference. */
    theme = signal<Theme>(this.resolveInitialTheme());

    constructor() {
        // Apply the resolved theme to the DOM on startup, but only in the browser (SSR has no document).
        if (this.isBrowser) {
            this.applyTheme(this.theme());
        }
    }

    /** Switches between light and dark, persisting the choice. */
    toggle(): void {
        this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
    }

    /**
     * Sets an explicit theme, persisting it to localStorage and reflecting it in the DOM immediately.
     *
     * @param theme the theme to switch to
     */
    setTheme(theme: Theme): void {
        this.theme.set(theme);
        if (this.isBrowser) {
            localStorage.setItem(STORAGE_KEY, theme);
            this.applyTheme(theme);
        }
    }

    /**
     * Resolves the theme to use on startup: a previously saved user choice if one exists,
     * otherwise the OS/browser color-scheme preference. Defaults to dark during SSR, since
     * there's no DOM/localStorage to read from.
     *
     * @returns the resolved initial theme
     */
    private resolveInitialTheme(): Theme {
        if (!this.isBrowser) return 'dark';

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') return stored;

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * Toggles both Tailwind's class strategy and PrimeNG's darkModeSelector, which use different
     * class names. Both go on `<html>` since it's an ancestor of everything PrimeNG themes.
     *
     * @param theme the theme to apply
     */
    private applyTheme(theme: Theme): void {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('my-app-dark', isDark);
    }
}
