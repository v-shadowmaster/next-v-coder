"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Browser() {
  const [url, setUrl] = useState("http://localhost:8000"); // Update to match your server URL
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey((prevKey) => prevKey + 1);
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() !== "") {
      handleRefresh();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-2 border-b border-border">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => console.log("Go back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => console.log("Go forward")}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <form onSubmit={handleNavigate} className="flex-1 ml-2">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
          />
        </form>
      </div>
      <div className="flex-1">
        {url ? (
          <iframe
            key={key}
            src={url}
            className="w-full h-full border-none"
            title="Browser Preview"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Enter a URL to preview
          </div>
        )}
      </div>
    </div>
  );
}
