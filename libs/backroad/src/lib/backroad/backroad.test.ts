import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BackroadSession } from '../server/sessions/session';
import { SocketManager } from './socket-manager';
import type { BackroadUser } from '@backroad/core';

function makeSession(id = 'test-session') {
  const session = new BackroadSession(id);
  const emit = vi.fn();
  // SocketManager is a process-global static map; register a stub so
  // br.login()/br.logout() can find a "socket" to emit on.
  SocketManager.register(id, {
    emit,
    // The rest of the Socket interface is irrelevant to these tests;
    // cast through unknown so we don't have to stub the full surface.
  } as unknown as Parameters<typeof SocketManager.register>[1]);
  return { session, emit };
}

describe('br.user', () => {
  it('defaults to logged out', () => {
    const { session } = makeSession();
    expect(session.rootNodeManager.user).toEqual({ isLoggedIn: false });
  });

  it('mirrors session.user when populated', () => {
    const { session } = makeSession();
    const user: BackroadUser = {
      isLoggedIn: true,
      id: 'u-1',
      name: 'Test User',
      email: 'test@example.com',
      raw: { whatever: true },
    };
    session.user = user;
    expect(session.rootNodeManager.user).toEqual(user);
    if (session.rootNodeManager.user.isLoggedIn) {
      expect(session.rootNodeManager.user.name).toBe('Test User');
    }
  });
});

describe('br.login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('defaults to the /auth/signin page when no provider given', () => {
    const { session, emit } = makeSession('login-default');
    session.rootNodeManager.login();
    expect(emit).toHaveBeenCalledWith(
      'auth_redirect',
      { url: '/auth/signin' },
      expect.any(Function)
    );
  });

  it('targets the social provider endpoint when one is given', () => {
    const { session, emit } = makeSession('login-google');
    session.rootNodeManager.login('google');
    expect(emit).toHaveBeenCalledWith(
      'auth_redirect',
      { url: '/api/auth/sign-in/social?provider=google' },
      expect.any(Function)
    );
  });

  it('URL-encodes the provider name', () => {
    const { session, emit } = makeSession('login-encode');
    session.rootNodeManager.login('with spaces');
    expect(emit).toHaveBeenCalledWith(
      'auth_redirect',
      { url: '/api/auth/sign-in/social?provider=with%20spaces' },
      expect.any(Function)
    );
  });
});

describe('br.logout', () => {
  it('emits auth_signout for the client to clear the session', () => {
    const { session, emit } = makeSession('logout');
    session.rootNodeManager.logout();
    expect(emit).toHaveBeenCalledWith(
      'auth_signout',
      undefined,
      expect.any(Function)
    );
  });
});

describe('components', () => {
  it('adds iframe nodes as a first-class component', () => {
    const { session } = makeSession('component-iframe');
    const value = session.mainPageNodeManager.iframe({
      id: 'docs-embed',
      title: 'Docs embed',
      src: 'https://example.com/docs',
      loading: 'lazy',
      referrerPolicy: 'strict-origin-when-cross-origin',
    });

    expect(value).toBeNull();
    expect(session.mainPageNodeManager.container.children[0]).toMatchObject({
      id: 'docs-embed',
      type: 'iframe',
      args: {
        title: 'Docs embed',
        src: 'https://example.com/docs',
        loading: 'lazy',
        referrerPolicy: 'strict-origin-when-cross-origin',
      },
    });
    session.renderQueue.flush();
  });
});
