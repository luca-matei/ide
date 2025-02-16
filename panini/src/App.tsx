import {useEffect, useState} from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import SidebarFileTree from "./components/SidebarFileTree.tsx";
import {FileData, FileNode} from "./components/SidebarFileTree.types.ts";
import SlimSidebar from "./components/SidebarSlim.tsx";
import {SlimSidebarTab} from "./components/SidebarSlim.types.ts";
import {TitleBar} from "./components/TitleBar.tsx";
import Editor from "./components/Editor.tsx";

function App() {
  const [treeData, setTreeData] = useState<FileNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const projectPath: string = "/home/pyrite/Dev/digital_marmot/lucamatei.eu";
  const [activeTab, setActiveTab] = useState<SlimSidebarTab>(null);
  const [selectedTreeFile, setSelectedTreeFile] = useState<FileData | null>(null);

  const handleTabClick = (tabId: SlimSidebarTab) => {
    setActiveTab(activeTab === tabId ? null : tabId);
  };

  const handleFileNodeSelect = (node: FileNode) => {
    if (node.is_dir) return;
    setSelectedTreeFile({
      name: node.name,
      path: node.path,
      color_tag: node.color_tag,
      has_errors: node.has_errors
    });
  }

  useEffect(() => {
    const loadFileTree = async () => {
      try {
        const tree = await invoke<FileNode>('get_file_tree', {
          path: projectPath
        });
        setTreeData(tree);
        console.log(tree);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    loadFileTree();
  }, []);

  return (
      <main className={"flex flex-col border border-white/20"}>
        <TitleBar />
        <div className={"flex-1 flex flex-row overflow-hidden"}>
          <SlimSidebar onTabClick={handleTabClick}/>
          <SidebarFileTree isOpen={activeTab === "files"} onFileNodeSelect={handleFileNodeSelect} treeData={treeData}/>
          <Editor selectedTreeFile={selectedTreeFile}/>
          <div>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </div>
      </main>
  );
}

export default App;
