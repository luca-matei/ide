import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faChevronDown, faChevronRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import {FileNode, SidebarFileTreeProps, TreeNodeProps} from "./SidebarFileTree.types.ts";


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
        className="flex items-center hover:bg-gray-700/50 cursor-pointer py-1 px-2 rounded-md transition-colors"
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={handleClick}
      >
        {node.is_dir ? (
          <>
            <span className="w-5 h-5 flex items-center justify-center">
              {isOpen ?
                <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 text-gray-400" /> :
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
              }
            </span>
            <FontAwesomeIcon icon={faFolder} className="w-4 h-4 text-yellow-500 mr-2" />
          </>
        ) : (
          <>
            <span className="w-5" />
            <FontAwesomeIcon icon={faFile} className="w-4 h-4 text-gray-400 mr-2" />
          </>
        )}
        <span className="text-sm text-gray-200 truncate">{node.name}</span>
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

const SidebarFileTree: React.FC<SidebarFileTreeProps> = ({ treeData }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);

  const handleNodeClick = (node: FileNode) => {
    setSelectedNode(node);
    // You can add additional functionality here
  };

  return (
    <aside className={`
      fixed left-0 top-0 h-full bg-gray-800 transition-all duration-300 
      ${isOpen ? 'w-64' : 'w-12'} 
      border-r border-gray-700 flex flex-col
    `}>
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-gray-700">
        {isOpen && <h2 className="text-gray-200 font-semibold">File Explorer</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-700 rounded-md transition-colors"
        >
          <FontAwesomeIcon icon={faAnglesLeft} className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {!treeData ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        ) : isOpen ? (
          <TreeNode
            node={treeData}
            level={0}
            onNodeClick={handleNodeClick}
          />
        ) : null}
      </div>

      {/* Status Bar */}
      {isOpen && selectedNode && (
        <div className="h-8 border-t border-gray-700 px-4 flex items-center">
          <span className="text-xs text-gray-400 truncate">
            Selected: {selectedNode.name}
          </span>
        </div>
      )}
    </aside>
  );
};

export default SidebarFileTree;
