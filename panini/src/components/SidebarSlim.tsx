import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faSearch,
  faCodeBranch,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import {SlimSidebarProps} from "./SidebarSlim.types.ts";

const SlimSidebar: React.FC<SlimSidebarProps> = ({ onTabClick }) => {
  const tabs = [
    { id: 'files', icon: faFolder, label: 'Explorer' },
    { id: 'search', icon: faSearch, label: 'Search' },
    { id: 'git', icon: faCodeBranch, label: 'Source Control' },
    { id: 'settings', icon: faGear, label: 'Settings' }
  ];

  return (
    <div className="bg-primary flex flex-col items-center border-r border-secondary">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={'px-2 py-1 m-1 rounded-md hover:bg-gray-700/50'}
          aria-label={tab.label}
        >
          <FontAwesomeIcon icon={tab.icon} className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};

export default SlimSidebar;
