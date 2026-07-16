import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // These routes require an authenticated session, which only exists in the browser —
  // prerendering them at build time has no session cookie and always 401s against /v1/auth/me.
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
