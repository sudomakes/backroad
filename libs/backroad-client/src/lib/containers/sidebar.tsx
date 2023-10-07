import { useState } from 'react';
import { TreeRender } from '../tree';
import { BackroadContainerRenderer } from '../types/containers';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

export const Sidebar: BackroadContainerRenderer<'sidebar'> = (props) => {
  const [open, setOpen] = useState(true);

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: '0' }}
            exit={{ opacity: 0, x: '-100%' }}
            className="w-[300px] h-screen bg-base-200 p-5 flex flex-col gap-3 fixed lg:static z-10"
          >
            <div className="flex justify-end">
              <div
                className="cursor-pointer mb-4"
                onClick={() => {
                  setOpen(false);
                }}
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
              </div>
            </div>

            {props.children.map((child) => {
              return <TreeRender tree={child} key={child.path} />;
            })}
          </motion.nav>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!open && (
          <motion.div
            className="btn-primary fixed px-5 mt-2 py-3 rounded-r-xl cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.getElementById('sidebar-portal') as HTMLElement
  );
};
