// src/TitleBar.tsx
import { useState, useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMinimize, faWindowMaximize, faWindowRestore, faXmark } from '@fortawesome/free-solid-svg-icons';

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  useEffect(() => {
    const appWindow = getCurrentWindow();
    document
      .getElementById('titlebar-minimize')
      ?.addEventListener('click', () => {
        setIsMaximized(false);
        appWindow.minimize();
      });
    document
      .getElementById('titlebar-maximize')
      ?.addEventListener('click', () => {
        setIsMaximized(!isMaximized);
        appWindow.toggleMaximize()
      });
    document
      .getElementById('titlebar-close')
      ?.addEventListener('click', () => appWindow.close());
  }, []);

  return (
    <div data-tauri-drag-region className="w-full flex justify-between items-center bg-primary border-b border-secondary">
      <div className="px-2"></div>
      <div className="flex">
        <button id="titlebar-minimize" className="px-2 py-1 m-1 hover:bg-gray-700/50 rounded-md">
          <FontAwesomeIcon icon={faWindowMinimize} className={"h-3 w-3"} />
        </button>
        <button id="titlebar-maximize" className="px-2 py-1 m-1 hover:bg-gray-700/50 rounded-md">
          <FontAwesomeIcon icon={isMaximized ? faWindowRestore : faWindowMaximize} className={"h-3 w-3"} />
        </button>
        <button id="titlebar-close" className="px-2 py-1 m-1 hover:bg-gray-700/50 rounded-md">
          <FontAwesomeIcon icon={faXmark} className={"h-3 w-3"} />
        </button>
      </div>
    </div>
  );
}