export interface FileData {
  name: string;
  path: string;
  color_tag: 'edited' | 'new' | null;
  has_errors: boolean;
}

export interface FileNode extends FileData {
  children: FileNode[];
  is_dir: boolean;
}

export interface TreeNodeProps {
  node: FileNode;
  level: number;
  onNodeClick?: (node: FileNode) => void;
}

export interface SidebarFileTreeProps {
  isOpen: boolean;
  onFileNodeSelect: (node: FileNode) => void;
  treeData: FileNode | null;
}
