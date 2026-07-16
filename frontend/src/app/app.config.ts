import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeng/themes';
import { credentialsInterceptor } from './shared/credentials.interceptor';

import Stonks from '../assets/themes/stonks-preset';

const MyCustomTheme = definePreset(Aura, {
    fontFamily: 'Montserrat, sans-serif',
    semantic: {
primary: {
            50: '#ffde82',  // Very soft cream
            100: '#FFF9D6', // Light pastel yellow
            200: '#FFF5B0', 
            300: '#FFF08A', 
            400: '#FDE68A', 
            500: '#FCD34D', // Your main "Soft Yellow"
            600: '#F59E0B', // Slightly darker for hover
            // ... add higher shades for contrast if needed
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
    }),
    MessageService,
  ]
};