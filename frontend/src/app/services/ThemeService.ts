import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    theme = signal<Theme>(this.resolveInitialTheme());

    constructor() {
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
            localStorage.setItem(STORAGE_KEY, theme);
            this.applyTheme(theme);
        }
    }

    private resolveInitialTheme(): Theme {
        if (!this.isBrowser) return 'dark';

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') return stored;

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /** Toggles both Tailwind's class strategy and PrimeNG's darkModeSelector, which use different class names. Both go on <html> since it's an ancestor of everything PrimeNG themes. */
    private applyTheme(theme: Theme): void {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('my-app-dark', isDark);
    }
}
