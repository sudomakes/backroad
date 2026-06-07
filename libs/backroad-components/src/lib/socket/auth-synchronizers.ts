/** Wires server-driven auth events (redirect, sign-out) to browser navigation. */
import { socket } from './client';

export const registerAuthSynchronizers = (): void => {
  socket.on('auth_redirect', ({ url }) => {
    window.location.assign(url);
  });

  // br.logout() flows through here. Hit better-auth's sign-out endpoint
  // directly (POST + cookies) so backroad-components stays free of the
  // better-auth client SDK, then navigate to the React /auth/signin route.
  socket.on('auth_signout', async () => {
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Sign-out request failed', err);
    } finally {
      window.location.assign('/auth/signin');
    }
  });
};
