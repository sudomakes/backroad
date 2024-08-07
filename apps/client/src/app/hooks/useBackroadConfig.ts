import { BackroadConfig } from '@backroad/core';
import { socket } from 'backroad-client';
import { useEffect, useState } from 'react';

export default function useBackroadConfig() {
  const [config, setConfig] = useState<BackroadConfig>();

  useEffect(() => {
    const handleConfig = (
      config: BackroadConfig,
      callback: (args: undefined) => void
    ) => {
      setConfig(config);
      callback(undefined);
    };
    socket.on('backroad_config', handleConfig);
    return () => {
      socket.off('backroad_config', handleConfig);
    };
  }, []);

  return config;
}
