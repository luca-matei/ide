import {useEffect, useState} from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import SidebarFileTree from "./components/SidebarFileTree.tsx";
import {FileNode} from "./components/SidebarFileTree.types.ts";

function App() {
  const [treeData, setTreeData] = useState<FileNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const projectPath: string = "/home/pyrite/Documents/ide-test";

  useEffect(() => {
    const loadFileTree = async () => {
      try {
        const tree = await invoke<FileNode>('get_file_tree', {
          path: projectPath
        });
        setTreeData(tree);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    loadFileTree();
  }, []);

  return (
    <main className="container">
      <SidebarFileTree treeData={treeData}/>
      <div></div>
      <div>
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </main>
  );
}

export default App;
