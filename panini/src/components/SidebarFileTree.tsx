import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import {SidebarFileTreeProps, TreeNodeProps} from "./SidebarFileTree.types.ts";


const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onNodeClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = () => {
    if (node.is_dir) {
      setIsOpen(!isOpen);
    }
    onNodeClick?.(node);
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center hover:bg-gray-700/50 cursor-pointer py-1 px-2 rounded-md"
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={handleClick}
      >
        {node.is_dir ? (
          <>
            <span className="flex items-center justify-center">
              {isOpen ?
                <FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5" /> :
                <FontAwesomeIcon icon={faChevronRight} className="w-1.5 h-1.5 mx-0.5" />
              }
            </span>
            <FontAwesomeIcon icon={faFolder} className="w-4 h-4 mx-1" />
          </>
        ) : (
          <>
            <span className="w-5" />
            <FontAwesomeIcon icon={faFile} className="w-4 h-4 mr-1" />
          </>
        )}
        <span className="text-sm">{node.name}</span>
      </div>

      {isOpen && node.is_dir && (
        <div className="animate-fadeIn">
          {node.children.map((child, index) => (
            <TreeNode
              key={`${child.name}-${index}`}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarFileTree: React.FC<SidebarFileTreeProps> = ({ isOpen, onFileNodeSelect, treeData }) => {
  return (
    <aside className={`
      h-full bg-primary
      ${isOpen ? 'flex w-64' : 'hidden'} 
      border-r border-secondary flex-col
    `}>
      <div className="flex-1 overflow-y-auto p-2">
        {!treeData ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse">Loading...</div>
          </div>
        ) : isOpen ? (
          <TreeNode
            node={treeData}
            level={0}
            onNodeClick={onFileNodeSelect}
          />
        ) : null}
      </div>
    </aside>
  );
};

export default SidebarFileTree;
