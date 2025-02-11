import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bug,
  GitBranch,
  Globe,
  Moon,
  Play,
  Save,
  Settings,
  Sun,
} from "lucide-react";
import { useTheme } from "./theme-provider";

interface TopBarProps {
  onToggleDebugger: () => void;
  onToggleVersionControl: () => void;
  onToggleBrowser: () => void;
}

export function TopBar({
  onToggleDebugger,
  onToggleVersionControl,
  onToggleBrowser,
}: TopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between p-2 border-b border-border bg-background">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button size="sm" variant="outline">
          <Play className="w-4 h-4 mr-2" />
          Run
        </Button>
        <Button size="sm" variant="outline" onClick={onToggleDebugger}>
          <Bug className="w-4 h-4 mr-2" />
          Debug
        </Button>
        <Button size="sm" variant="outline" onClick={onToggleVersionControl}>
          <GitBranch className="w-4 h-4 mr-2" />
          Git
        </Button>
        <Button size="sm" variant="outline" onClick={onToggleBrowser}>
          <Globe className="w-4 h-4 mr-2" />
          Browser
        </Button>
      </div>
      <Input className="w-64" placeholder="Search files..." />
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </Button>
        <Button size="icon" variant="ghost">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
