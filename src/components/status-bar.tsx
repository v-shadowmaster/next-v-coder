import { Circle } from "lucide-react";

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-4 py-1 text-xs border-t border-border bg-muted">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
          Connected
        </span>
        <span>JavaScript</span>
      </div>
      <div>Ln 1, Col 1</div>
    </div>
  );
}
