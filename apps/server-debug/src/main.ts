import path from 'path';
import { startBackroadServer } from 'backroad';

// for debugging and booting the server without cli
if (process.env['NX_TASK_TARGET_TARGET'] === 'serve') {
  startBackroadServer({
    scriptPath: path.join(
      process.cwd(),
      'apps',
      'server-debug',
      'src',
      'test-script.ts'
    ),
  });
}
