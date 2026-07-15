import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeng/themes';
import { credentialsInterceptor } from './shared/credentials.interceptor';

import Stonks from '../assets/themes/stonks-preset';

const MyCustomTheme = definePreset(Aura, {
    fontFamily: 'Montserrat, sans-serif',
    semantic: {
        primary: {
            50: '{zinc.50}',
            100: '{zinc.100}',
            500: '{zinc.500}',
            // Add other shades as needed
        }
    }
});
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    providePrimeNG({
      theme: {
        preset: MyCustomTheme,
        options: {
          darkModeSelector: '.my-app-dark'
        }
      },
      ripple: true,
    })
  ]
};