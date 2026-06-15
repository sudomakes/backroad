import { socket } from 'backroad-components';
import { cn } from 'backroad-ui';
import { useEffect, useState } from 'react';
import { NavbarMenu } from './menu';

export const Navbar = (props: { connected: boolean }) => {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const onRunning = () => {
      setRunning(true);
      setTimeout(() => setRunning(false), 2000);
    };
    socket.on('running', onRunning);
    return () => {
      socket.off('running', onRunning);
    };
  }, []);

  return (
    <header className="fixed top-3 right-4 z-[5] flex items-center gap-1 rounded-full border border-border bg-background/70 py-1 pr-1 pl-2 shadow-sm backdrop-blur-md">
      {running && (
        <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Running
        </div>
      )}
      <div className="flex items-center gap-2 px-2 text-xs font-medium text-muted-foreground">
        <span
          className={cn(
            'size-2 rounded-full transition-colors',
            props.connected ? 'bg-emerald-500' : 'bg-muted-foreground/50'
          )}
        />
        {props.connected ? 'Connected' : 'Disconnected'}
      </div>
      <NavbarMenu />
    </header>
  );
};
