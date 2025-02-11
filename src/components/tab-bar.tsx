import { X } from "lucide-react";

interface TabBarProps {
  openFiles: string[];
  activeFile: string;
  onChangeTab: (tab: string) => void;
  onCloseTab: (tab: string) => void;
}

export function TabBar({
  openFiles,
  activeFile,
  onChangeTab,
  onCloseTab,
}: TabBarProps) {
  return (
    <div className="flex bg-muted border-b border-border">
      {openFiles.map((file) => (
        <div
          key={file}
          className={`px-4 py-2 cursor-pointer flex items-center ${
            activeFile === file
              ? "bg-background text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => onChangeTab(file)}
        >
          {file}
          <X
            className="w-4 h-4 ml-2 hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab(file);
            }}
          />
        </div>
      ))}
    </div>
  );
}
