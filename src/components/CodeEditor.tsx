"use client";

import Editor from "@monaco-editor/react";
function CodeEditor() {
  return (
    <div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// الفرحة المنتظرة ❤️💯"
      />
    </div>
  );
}

export default CodeEditor;
