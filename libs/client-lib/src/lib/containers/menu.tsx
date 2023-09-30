import { useState } from 'react';
import { TreeRender } from '../tree';
import { BackroadContainerRenderer } from '../types/containers';
import { createPortal } from 'react-dom';

export const Menu: BackroadContainerRenderer<'menu'> = (props) => {
  const [open, setOpen] = useState(true);

  return createPortal(
    open && (
      <div className="w-[300px] h-screen bg-base-200 p-5 flex flex-col gap-3 fixed lg:static z-10">
        <div className="flex justify-end">
          <div
            className="cursor-pointer mb-4"
            onClick={() => {
              setOpen(false);
            }}
          >
            <svg
              className="swap-on fill-current"
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
      </div>
    ),
    document.getElementById('menu-portal') as HTMLElement
  );
};
