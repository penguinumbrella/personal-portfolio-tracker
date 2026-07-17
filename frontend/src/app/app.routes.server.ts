import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * SSR render mode per route. The authenticated routes below require a session, which only
 * exists in the browser — prerendering them at build time has no session cookie and always
 * 401s against `/v1/auth/me`, so they're rendered client-side instead. Everything else is
 * prerendered.
 */
export const serverRoutes: ServerRoute[] = [
  { path: 'dashboard', renderMode: RenderMode.Client },
  { path: 'account', renderMode: RenderMode.Client },
  { path: 'account/:id', renderMode: RenderMode.Client },
  { path: 'security', renderMode: RenderMode.Client },
  { path: 'security/:id', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
