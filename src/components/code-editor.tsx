"use client";

import { useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  fileName: string;
  content: string;
  onContentChange: (newContent: string) => void;
}

export function CodeEditor({
  fileName,
  content,
  onContentChange,
}: CodeEditorProps) {
  const editorRef = useRef(null);
  const isSaved = useRef(true);
  const lastContent = useRef(content);

  useEffect(() => {
    // Reset saved state when file changes
    lastContent.current = content;
    isSaved.current = true;
  }, [fileName, content]);

  useEffect(() => {
    let saveTimer: NodeJS.Timeout;

    if (!isSaved.current) {
      saveTimer = setTimeout(() => {
        onContentChange(lastContent.current);
        isSaved.current = true;
      }, 2000);
    }

    return () => {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
    };
  }, [fileName, content, onContentChange]);

  const handleEditorChange = (value: string | undefined) => {
    const newContent = value || "";
    lastContent.current = newContent;
    isSaved.current = false;
    onContentChange(newContent);
  };

  return (
    <div className="w-full h-full relative">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        theme="vs-dark"
        value={content}
        onChange={handleEditorChange}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "Consolas, 'Courier New', monospace",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          formatOnPaste: true,
          formatOnType: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
        }}
      />
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        {isSaved.current ? "Saved" : "Unsaved"}
      </div>
    </div>
  );
}
