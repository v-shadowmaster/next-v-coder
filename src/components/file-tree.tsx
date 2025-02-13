"use client";

import { useEffect, useState } from "react";
import { ChevronRight, File, Folder, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import socket from "@/lib/socket";

type FileNode = {
  [key: string]: FileNode | null;
};

interface FileTreeProps {
  onFileOpen: (filePath: string, content: string) => void;
  tree: FileNode;
}

export function FileTree({ onFileOpen, tree }: FileTreeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [fileTree, setFileTree] = useState<FileNode>(tree);
  const [selectedItem, setSelectedItem] = useState<string>("");

  useEffect(() => {
    // Fetch initial file tree
    fetch("http://localhost:8000/files")
      .then((res) => res.json())
      .then((data) => setFileTree(data.tree))
      .catch((err) => console.error("Error fetching file tree:", err));

    // Listen for file changes
    socket.on("file:refresh", (filePath: string) => {
      fetch("http://localhost:8000/files")
        .then((res) => res.json())
        .then((data) => setFileTree(data.tree))
        .catch((err) => console.error("Error refreshing file tree:", err));
    });

    return () => {
      socket.off("file:refresh");
    };
  }, []);

  const handleClick = async (e: React.MouseEvent, fullPath: string) => {
    e.stopPropagation();
    setSelectedItem(fullPath);
    if (!fullPath) return;

    try {
      const response = await fetch(
        `http://localhost:8000/files/content?path=${fullPath}`
      );
      const data = await response.json();
      onFileOpen(fullPath, data.content); // Pass both path and content
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-muted font-mono">
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-8 font-mono"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <FileTreeNode
          fileName="/"
          path=""
          nodes={fileTree}
          onFileOpen={onFileOpen}
          searchTerm={searchTerm}
          expandedFolders={expandedFolders}
          setExpandedFolders={setExpandedFolders}
          level={0}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </div>
    </div>
  );
}

interface FileTreeNodeProps {
  fileName: string;
  path: string;
  nodes: FileNode | null;
  onFileOpen: (filePath: string, content: string) => void;
  searchTerm: string;
  expandedFolders: Set<string>;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Set<string>>>;
  level: number;
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

function FileTreeNode({
  fileName,
  path,
  nodes,
  onFileOpen,
  searchTerm,
  expandedFolders,
  setExpandedFolders,
  level,
  selectedItem,
  setSelectedItem,
}: FileTreeNodeProps) {
  const isDir = !!nodes;
  const fullPath = path ? `${path}/${fileName}` : fileName;
  const isExpanded = expandedFolders.has(fullPath);
  const matchesSearch = fileName
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const toggleFolder = () => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(fullPath)) {
        next.delete(fullPath);
      } else {
        next.add(fullPath);
      }
      return next;
    });
  };

  const onClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(fullPath);
    if (isDir) {
      toggleFolder();
    } else {
      try {
        const response = await fetch(
          `http://localhost:8000/files/content?path=${fullPath}`
        );
        const data = await response.json();
        onFileOpen(fullPath, data.content); // Pass both path and content
      } catch (error) {
        console.error("Error fetching file content:", error);
      }
    }
  };

  if (!matchesSearch && !isExpanded) return null;
  //if (fileName === "node_modules") return null;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer hover:bg-accent group font-mono",
          isDir ? "font-medium" : "file-node",
          selectedItem === fullPath ? "bg-accent" : ""
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={onClick}
      >
        {isDir ? (
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform",
              isExpanded && "transform rotate-90"
            )}
          />
        ) : (
          <File className="w-4 h-4" />
        )}
        <span>{fileName}</span>
      </div>
      {isDir && isExpanded && (
        <div>
          {Object.entries(nodes || {}).map(([name, childNodes]) => (
            <FileTreeNode
              key={name}
              fileName={name}
              path={fullPath}
              nodes={childNodes}
              onFileOpen={onFileOpen}
              searchTerm={searchTerm}
              expandedFolders={expandedFolders}
              setExpandedFolders={setExpandedFolders}
              level={level + 1}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
