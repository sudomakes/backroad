import { useEffect, useState } from 'react';
import { Config } from '@backroad/backroad';
import { getBackroadConfig, socket } from 'backroad-client';

export default function useBackroadConfig() {
  const [config, setConfig] = useState<Config>();

  useEffect(() => {
    socket.on('config', (backroadConfig, callback) => {
      setConfig(backroadConfig);
      callback();
    });
    getBackroadConfig().then(() => {
      console.log('Socket emitted get_config event');
    });
  }, []);

  return config;
}
