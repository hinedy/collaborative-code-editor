"use client";

import Editor from "@monaco-editor/react";

export function CodeEditor({
  activeFileId,
  language,
  theme,
  editorContent,
  handleEditorChange,
}: {
  activeFileId: string | null;
  language: string;
  theme: "vs-dark" | "vs-light";
  editorContent: string;
  handleEditorChange: (value: string | undefined) => void;
}) {
  return (
    activeFileId && (
      <Editor
        height="75vh"
        language={language}
        theme={theme}
        value={editorContent}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          tabSize: 2,
          quickSuggestions: true,
        }}
      />
    )
  );
}
