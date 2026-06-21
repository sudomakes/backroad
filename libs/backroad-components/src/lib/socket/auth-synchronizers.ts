/** Wires server-driven auth events (redirect, sign-out) to browser navigation. */
import { withBasePath } from './base-path';
import { backroadFetch } from './fetch';
import { socket } from './client';

export const registerAuthSynchronizers = (): void => {
  // Server-built auth URLs (from br.login/logout) are root-relative and don't
  // know the mount sub-path, so withBasePath prefixes it (and leaves absolute
  // or already-prefixed URLs alone).
  socket.on('auth_redirect', ({ url }) => {
    window.location.assign(withBasePath(url));
  });

  // br.logout() flows through here. Hit better-auth's sign-out endpoint
  // directly (POST + cookies) so backroad-components stays free of the
  // better-auth client SDK, then navigate to the React /auth/signin route.
  socket.on('auth_signout', async () => {
    try {
      await backroadFetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Sign-out request failed', err);
    } finally {
      window.location.assign(withBasePath('/auth/signin'));
    }
  });
};
