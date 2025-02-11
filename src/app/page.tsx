"use client";

import { useState } from "react";
import { FileTree } from "@/components/file-tree";
import { CodeEditor } from "@/components/code-editor";
import TerminalUI from "@/components/terminal";
import { TopBar } from "@/components/top-bar";
import { StatusBar } from "@/components/status-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { Browser } from "@/components/Browser";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { TabBar } from "@/components/tab-bar";
import socket from "@/lib/socket";

type OpenFile = {
  name: string;
  path: string; // Add this to keep track of full path
  content: string;
};

type FileNode = {
  [key: string]: FileNode | null;
};

const initialFileTree: FileNode = {
  src: {
    "index.ts": null,
    "app.ts": null,
  },
  public: {
    "index.html": null,
    "styles.css": null,
  },
  "package.json": null,
  "tsconfig.json": null,
};

export default function CloudIDE() {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string>("");
  const [showDebugger, setShowDebugger] = useState(false);
  const [showVersionControl, setShowVersionControl] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);

  const handleFileOpen = async (filePath: string, content: string) => {
    const fileName = filePath.split("/").pop() || "";
    if (!openFiles.some((file) => file.name === fileName)) {
      setOpenFiles([
        ...openFiles,
        {
          name: fileName,
          path: filePath, // Store the full path
          content: content,
        },
      ]);
    }
    setActiveFile(fileName);
  };

  const handleFileClose = (fileName: string) => {
    setOpenFiles(openFiles.filter((file) => file.name !== fileName));
    if (activeFile === fileName) {
      setActiveFile(openFiles[0]?.name || "");
    }
  };

  const handleCodeChange = (fileName: string, newContent: string) => {
    const file = openFiles.find((f) => f.name === fileName);
    if (!file) return;

    setOpenFiles(
      openFiles.map((file) =>
        file.name === fileName ? { ...file, content: newContent } : file
      )
    );

    // Emit file change with the full path
    socket.emit("file:change", {
      path: file.path,
      content: newContent,
    });
  };

  const getCurrentFile = () => {
    const file = openFiles.find((f) => f.name === activeFile);
    return file
      ? {
          path: file.path,
          content: file.content,
        }
      : undefined;
  };

  const handleSave = () => {
    const file = openFiles.find((f) => f.name === activeFile);
    if (file) {
      socket.emit("file:change", {
        path: file.path,
        content: file.content,
      });
    }
  };

  const handleRun = () => {
    // Implement run functionality here
    console.log("Running file:", activeFile);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
        <TopBar
          onToggleDebugger={() => setShowDebugger(!showDebugger)}
          onToggleVersionControl={() =>
            setShowVersionControl(!showVersionControl)
          }
          onToggleBrowser={() => setShowBrowser(!showBrowser)}
          currentFile={getCurrentFile()} // Now using getCurrentFile
          onSave={handleSave} // Now using handleSave
          onRun={handleRun} // Now using handleRun
        />
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={10} maxSize={40}>
              <div className="h-full">
                <FileTree onFileOpen={handleFileOpen} tree={initialFileTree} />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={60} minSize={30}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={70} minSize={30}>
                  <div className="h-full flex flex-col">
                    <TabBar
                      openFiles={openFiles.map((f) => f.name)}
                      activeFile={activeFile}
                      onChangeTab={setActiveFile}
                      onCloseTab={handleFileClose}
                    />
                    <div className="flex-1 overflow-hidden">
                      <CodeEditor
                        fileName={activeFile}
                        content={
                          openFiles.find((f) => f.name === activeFile)
                            ?.content || ""
                        }
                        onContentChange={(newContent) =>
                          handleCodeChange(activeFile, newContent)
                        }
                      />
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={30} minSize={10}>
                  <TerminalUI />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            {showBrowser && (
              <>
                <ResizableHandle />
                <ResizablePanel defaultSize={20} minSize={10}>
                  <div className="h-full">
                    <Browser />
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
        <StatusBar />
      </div>
    </ThemeProvider>
  );
}
