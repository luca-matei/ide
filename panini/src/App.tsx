import {useEffect, useState} from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import SidebarFileTree from "./components/SidebarFileTree.tsx";
import {FileNode} from "./components/SidebarFileTree.types.ts";
import SlimSidebar from "./components/SidebarSlim.tsx";
import {SlimSidebarTab} from "./components/SidebarSlim.types.ts";
import {TitleBar} from "./components/TitleBar.tsx";

function App() {
  const [treeData, setTreeData] = useState<FileNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const projectPath: string = "/home/pyrite/Documents/ide-test";
  const [activeTab, setActiveTab] = useState<SlimSidebarTab>(null);

  const handleTabClick = (tabId: SlimSidebarTab) => {
    setActiveTab(activeTab === tabId ? null : tabId);
  };

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
      <main className={"flex flex-col"}>
        <TitleBar />
        <div className={"flex-1 flex flex-row overflow-hidden"}>
          <SlimSidebar onTabClick={handleTabClick}/>
          <SidebarFileTree isOpen={activeTab === "files"} treeData={treeData}/>
          <div></div>
          <div>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </div>
      </main>
  );
}

export default App;
