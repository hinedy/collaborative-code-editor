"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import { useEditorStore } from "@/lib/store";
import { socket } from "@/lib/socket";
import { useClerk } from "@clerk/nextjs";

export function CodeEditor() {
  const clerk = useClerk();
  const params = useParams();
  const { code, language, theme, setCode } = useEditorStore();
  const roomId = params.roomId as string;

  useEffect(() => {
    socket.on("code:init", (initialCode: string) => {
      setCode(initialCode);
    });

    socket.on("code:update", (newCode: string) => {
      setCode(newCode);
    });

    return () => {
      socket.off("code:init");
      socket.off("code:update");
    };
  }, [setCode]);

  const handleEditorChange = (value: string = "") => {
    setCode(value);
    socket.emit("code:change", { roomId, code: value });
  };

  return (
    clerk.loaded && (
      <Editor
        height="75vh"
        language={language}
        theme={theme}
        value={code}
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
