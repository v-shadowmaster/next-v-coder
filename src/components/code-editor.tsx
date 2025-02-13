"use client";

import { useEffect, useRef } from "react";
import { Editor, loader } from "@monaco-editor/react";

loader.init().then((monaco) => {
  monaco.editor.defineTheme("github-dark-default", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "d1d5da" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "string", foreground: "a5d6ff" },
      { token: "number", foreground: "79c0ff" },
      { token: "comment", foreground: "8b949e" },
      { token: "type", foreground: "ffa657" },
      { token: "class", foreground: "ffa657" },
      { token: "function", foreground: "d2a8ff" },
      { token: "variable", foreground: "ffa657" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editor.lineHighlightBackground": "#161b22",
      "editor.selectionBackground": "#3392FF44",
      "editor.inactiveSelectionBackground": "#3392FF22",
      "editorCursor.foreground": "#c9d1d9",
      "editorWhitespace.foreground": "#484f58",
      "editorIndentGuide.background": "#21262d",
    },
  });
});

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
        theme="github-dark-default"
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
