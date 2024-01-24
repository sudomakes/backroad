import { socket, ThemeOptions } from 'backroad-client';
import { useEffect, useRef } from 'react';
import { themeChange } from 'theme-change';
import { WrenchIcon } from '@heroicons/react/24/outline';

const THEME_KEY = 'backroad-theme';

export const NavbarMenu = () => {
  const settingModalRef = useRef<HTMLDialogElement>(null);

  const themeOptionsToTypes: Record<ThemeOptions, string> = {
    light: 'light',
    dark: 'dracula',
  };

  const SettingsModal = () => {
    useEffect(() => {
      themeChange(false);
      socket.on('theme', (theme, callback) => {
        localStorage.setItem(THEME_KEY, themeOptionsToTypes[theme]);
        callback();
      });
    }, []);
    // <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>open modal</button>
    return (
      <dialog className="modal" ref={settingModalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Settings</h3>
          <div className="form-control w-full max-w-xs">
            {' '}
            <label className="label">
              <span className="backroad-label">Theme Preference</span>
            </label>
            <select
              data-choose-theme
              data-key={THEME_KEY}
              className="select select-bordered w-full"
              onChange={(e) => {
                console.log('changed to', e.target.value);
              }}
            >
              <option value="light">Light</option>
              <option value="dracula">Dark</option>
            </select>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    );
  };
  return (
    <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
      <button tabIndex={0} className="btn m-1  btn-square btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-5 h-5 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li
          onClick={() => {
            settingModalRef.current?.showModal();
          }}
        >
          <span>
            <WrenchIcon width={20} />
            <span>Settings</span>
          </span>
        </li>
      </ul>
      <SettingsModal />
    </div>
  );
};
