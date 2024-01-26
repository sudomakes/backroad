import { BackroadNodeManager } from '../backroad';
import { startBackroadServer } from '../server';
import { sessionManager } from '../server/sessions/session-manager';
import { socketEventHandlers } from '../server/server-socket-event-handlers';
import { SocketManager } from '../backroad/socket-manager';
export const run = async (
  executor: (nodeManager: BackroadNodeManager) => void | Promise<void>,
  backroadOptions?: {
    port?: number;
    theme?: 'light' | 'dark';
  }
) => {
  const port = backroadOptions?.port || 3333;
  const config = {
    theme: backroadOptions?.theme,
  };

  (
    await startBackroadServer({
      port: port,
    })
  ).on('connection', async (socket) => {
    const backroadSession = sessionManager.getSession(
      socket.nsp.name.slice(1),
      {
        upsert: true,
      }
    );
    SocketManager.register(backroadSession.sessionId, socket);
    const runExecutor = async () => {
      backroadSession.resetTree();
      await executor(backroadSession.mainPageNodeManager);
    };
    // execute once to populate defaults and stuff

    // socket.on(
    //   'get_value',
    //   socketEventHandlers.getValue(socket, backroadSession)
    // );
    socket.on(
      'set_value',
      socketEventHandlers.setValue(socket, backroadSession, runExecutor)
    );
    socket.on(
      'run_script',
      socketEventHandlers.runScript(socket, backroadSession, runExecutor)
    );

    socket.on(
      'unset_value',
      socketEventHandlers.unsetValue(socket, backroadSession, runExecutor)
    );
    // Only fire if user explicitly passed in a theme option
    socket.on(
      'get_config',
      socketEventHandlers.getConfig(socket, config, runExecutor)
    );
    // socket.on("get_tree", socketEventHandlers.getTree(socket, backroadSession));
  });
};
