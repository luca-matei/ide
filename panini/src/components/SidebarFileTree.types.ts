export interface FileNode {
  name: string;
  children: FileNode[];
  is_dir: boolean;
}

export interface TreeNodeProps {
  node: FileNode;
  level: number;
  onNodeClick?: (node: FileNode) => void;
}

export interface SidebarFileTreeProps {
  treeData: FileNode | null;
}
