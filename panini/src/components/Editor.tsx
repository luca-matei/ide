'use client';

import React, {useEffect, useState} from "react";
import {EditorProps} from "./Editor.types.ts";
import {FileData} from "./SidebarFileTree.types.ts";
import {invoke} from "@tauri-apps/api/core";

interface EditorTab {
  name: string;
}

interface EditorContentProps {
  lineNo: number;
  content: string | null;
}

interface EditorTabsProps {
}

interface EditorLineProps {
  lineNo: number;
  index: number;
  content: string;
  highlightedLine: number;
  onLineHighlight: (index: number) => () => void;
}

const EditorLine: React.FC<EditorLineProps> = ({lineNo, index, content, highlightedLine, onLineHighlight}) => {
  const lineNoWidth = lineNo.toString().length;
  const lineNoPadding = "0".repeat(lineNoWidth - (index + 1).toString().length);

  return (
    <div className={`flex ${highlightedLine === index ? 'bg-white/5' : ''}`} onClick={onLineHighlight(index)}>
      <span className={"pl-3 pr-5 pt-1 mr-1 text-sm opacity-20 border-r border-white/20 select-none"}>
        <span className={"opacity-0"}>{lineNoPadding}</span>
        {index + 1}
      </span>
      <span className={"whitespace-pre-wrap"}>{content}</span>
    </div>
  );
}

const EditorTabs: React.FC<EditorTabsProps> = () => {
  const tabs: EditorTab[] = []
  return (
    <div className={"w-full"}>
      {tabs.map((tab) => (
        <button key={tab.name} className={'px-2 py-1 m-1 rounded-md hover:bg-gray-700/50'}>
          {tab.name}
        </button>
      ))}
    </div>
  );
}

const EditorContent: React.FC<EditorContentProps> = ({lineNo, content}) => {
  const [highlightedLine, setHighlightedLine] = useState<number>(-1);
  if (!content) return null;

  const lines = content.split("\n");

  function handleLineHighlight(index: number) {
    return () => {
      setHighlightedLine(index);
    }
  }

  return (
    <div className={"h-full overflow-auto"}>
      {lines.map((line, index) => (
        <EditorLine
          key={index}
          lineNo={lineNo}
          index={index}
          content={line}
          highlightedLine={highlightedLine}
          onLineHighlight={handleLineHighlight}
        />
      ))}
    </div>
  );
}

const Editor: React.FC<EditorProps> = ({selectedTreeFile}) => {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [lineNo, setLineNo] = useState<number>(0);

  useEffect(() => {
    if (!selectedFile) return;
    const loadFileContent = async () => {
      try {
        const response = await invoke<any>('get_file', {
          path: selectedFile.path
        });
        setContent(response.content);
        setLineNo(response.line_no);
      } catch (err) {
        console.error(err);
      }
    };
    loadFileContent();
  }, [selectedFile]);

  useEffect(() => {
    // Open files selected from the sidebar
    if (!selectedTreeFile) return;
    setSelectedFile(selectedTreeFile);
  }, [selectedTreeFile]);

  return (
    <div className={"bg-secondary h-full"}>
      <EditorTabs />
      <EditorContent lineNo={lineNo} content={content} />
    </div>
  );
}

export default Editor;