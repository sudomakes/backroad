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

describe('render queue runId stamping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // The flush is coalesced onto a microtask, so let it run.
  const flushMicrotasks = () => Promise.resolve();

  it('stamps emitted patches with the run that produced them', async () => {
    const { session, emit } = makeSession('rq-stamp');
    session.runId = 7;
    session.renderQueue.addToQueue('node-a');
    await flushMicrotasks();
    expect(emit).toHaveBeenCalledWith(
      'render',
      { nodes: ['node-a'], runId: 7 },
      expect.any(Function)
    );
  });

  it('splits a coalesced flush into one emit per run group', async () => {
    const { session, emit } = makeSession('rq-split');
    // Two patches pushed in the same tick but produced by different runs (an
    // older async run still emitting while a newer run has taken over) must not
    // share a runId — otherwise the stale patch would slip past the client gate.
    session.runId = 1;
    session.renderQueue.addToQueue('old');
    session.runId = 2;
    session.renderQueue.addToQueue('new');
    await flushMicrotasks();

    const renderCalls = emit.mock.calls.filter(([event]) => event === 'render');
    expect(renderCalls).toHaveLength(2);
    expect(renderCalls[0]).toEqual([
      'render',
      { nodes: ['old'], runId: 1 },
      expect.any(Function),
    ]);
    expect(renderCalls[1]).toEqual([
      'render',
      { nodes: ['new'], runId: 2 },
      expect.any(Function),
    ]);
  });

  it('bumps runId on resetTree so post-reset patches outrank pre-reset ones', () => {
    const { session } = makeSession('rq-reset');
    const before = session.runId;
    session.resetTree();
    expect(session.runId).toBe(before + 1);
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
