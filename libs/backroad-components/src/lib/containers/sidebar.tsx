import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TreeRender } from '../tree';
import { BackroadContainerRenderer } from '../types/containers';
import { createPortal } from 'react-dom';

export const Sidebar: BackroadContainerRenderer<'sidebar'> = (props) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return createPortal(
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close sidebar"
        className="fixed inset-0 z-[9] bg-black/30 transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={() => setOpen(false)}
      />

      {/* Sheet */}
      <nav
        className="w-screen max-w-[300px] h-full border-r overflow-auto bg-card p-5 flex flex-col gap-3 fixed top-0 left-0 z-10 transition-transform duration-300 ease-in-out"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Close sidebar"
            className="cursor-pointer mb-4"
            onClick={() => setOpen(false)}
          >
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </button>
        </div>

        {props.children.map((child) => {
          return <TreeRender tree={child} key={child.path} />;
        })}
      </nav>

      {/* Reopen tab */}
      {!open && (
        <button
          type="button"
          aria-label="Open sidebar"
          className="btn btn-primary fixed top-4 left-0 px-5 z-10 py-3 rounded-l-none rounded-r-xl cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="fill-current"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
            />
            <path
              fillRule="evenodd"
              d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      )}
    </>,
    document.getElementById('sidebar-portal') as HTMLElement
  );
};
