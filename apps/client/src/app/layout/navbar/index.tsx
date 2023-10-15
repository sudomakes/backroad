import { socket } from 'backroad-client';
import { useEffect, useState } from 'react';
import { NavbarMenu } from './menu';

export const Navbar = (props: { connected: boolean }) => {
  const [running, setRunning] = useState(false);
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onRunning = () => {
      setRunning(true);
      setTimeout(() => {
        setRunning(false);
      }, 2000);
    };
    socket.on('running', onRunning);
  });


  const handleScroll = () => {
    console.log("window", window.scrollY)
    if (window.scrollY !== 0) {
      setScrolled(true);
    }
    else {
      setScrolled(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll)
  })
  return (
    <div className={`navbar fixed top-0 right-0 z-[5] opacity-100 transition-all ${scrolled ? "bg-base-200 border-b" : 'bg-base-100'} mb-5`}>
      <div className="navbar-start"></div>
      <div className="navbar-end gap-4">
        <div className="flex gap-2 mr-3">
          {running && (
            <>
              <span className="loading loading-ring loading-md"></span>
              <span>Running</span>
            </>
          )}
        </div>
        <button
          className="btn btn-outline"
        // data-toggle-theme="cupcake,dracula"
        // data-set-theme="dracula"
        // data-act-class="ACTIVECLASS"
        >
          <div>{props.connected ? 'Connected' : 'Disconnected'}</div>
          <div className="badge badge-primary badge-xs"></div>
        </button>
        <NavbarMenu />
      </div>
    </div>
  );
};
