import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BackroadSession } from '../server/sessions/session';
import { SocketManager } from './socket-manager';

function makeSession(id = 'test-session') {
  const session = new BackroadSession(id);
  const emit = vi.fn();
  SocketManager.register(id, {
    emit,
  } as unknown as Parameters<typeof SocketManager.register>[1]);
  return { session, emit };
}

describe('br.sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds a sidebar container node to the tree', () => {
    const { session } = makeSession('sidebar-basic');
    const sidebar = session.rootNodeManager.sidebar({});
    session.renderQueue.flush();

    const node = session.rootNodeManager.container.children.find(
      (c) => c.type === 'sidebar'
    );
    expect(node).toBeDefined();
    expect(node!.type).toBe('sidebar');
  });

  it('returns open() and close() methods', () => {
    const { session } = makeSession('sidebar-methods');
    const sidebar = session.rootNodeManager.sidebar({});
    session.renderQueue.flush();

    expect(typeof sidebar.open).toBe('function');
    expect(typeof sidebar.close).toBe('function');
  });

  it('close() emits props_change with open: false', () => {
    const { session, emit } = makeSession('sidebar-close');
    const sidebar = session.rootNodeManager.sidebar({});
    session.renderQueue.flush();

    emit.mockClear();
    sidebar.close();

    expect(emit).toHaveBeenCalledWith(
      'props_change',
      expect.objectContaining({
        args: expect.objectContaining({ open: false }),
      }),
      expect.any(Function)
    );
  });

  it('open() emits props_change with open: true', () => {
    const { session, emit } = makeSession('sidebar-open');
    const sidebar = session.rootNodeManager.sidebar({});
    session.renderQueue.flush();

    emit.mockClear();
    sidebar.open();

    expect(emit).toHaveBeenCalledWith(
      'props_change',
      expect.objectContaining({
        args: expect.objectContaining({ open: true }),
      }),
      expect.any(Function)
    );
  });

  it('close() targets the correct sidebar path', () => {
    const { session, emit } = makeSession('sidebar-path');
    const sidebar = session.rootNodeManager.sidebar({});
    session.renderQueue.flush();

    const sidebarPath = sidebar.container.path;
    emit.mockClear();
    sidebar.close();

    expect(emit).toHaveBeenCalledWith(
      'props_change',
      expect.objectContaining({
        path: sidebarPath,
      }),
      expect.any(Function)
    );
  });

  it('defaultOpen is passed through to args', () => {
    const { session } = makeSession('sidebar-default-open');
    const sidebar = session.rootNodeManager.sidebar({ defaultOpen: false });
    session.renderQueue.flush();

    const node = session.rootNodeManager.container.children.find(
      (c) => c.type === 'sidebar'
    );
    expect(node).toBeDefined();
    expect((node as any).args.defaultOpen).toBe(false);
  });

  it('multiple sidebars get distinct paths', () => {
    const { session } = makeSession('sidebar-multi');
    const s1 = session.rootNodeManager.sidebar({});
    const s2 = session.rootNodeManager.sidebar({});
    session.renderQueue.flush();

    expect(s1.container.path).not.toBe(s2.container.path);
  });

  it('close() on one sidebar does not affect another', () => {
    const { session, emit } = makeSession('sidebar-isolation');
    const s1 = session.rootNodeManager.sidebar({});
    const s2 = session.rootNodeManager.sidebar({});
    session.renderQueue.flush();

    emit.mockClear();
    s1.close();

    // Only one props_change call for s1
    const propsChangeCalls = emit.mock.calls.filter(
      (c) => c[0] === 'props_change'
    );
    expect(propsChangeCalls).toHaveLength(1);
    expect(propsChangeCalls[0][1].path).toBe(s1.container.path);
  });
});
