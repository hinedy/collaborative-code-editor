"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useEditorStore } from "@/lib/store";
import { CodeEditor } from "@/components/editor/code-editor";
import { LanguageSelect } from "@/components/editor/language-select";
import { ThemeToggle } from "@/components/editor/theme-toggle";
import { socket } from "@/lib/socket";

export default function EditorRoomPage() {
  const params = useParams();
  const { joinRoom, leaveRoom } = useEditorStore();
  const roomId = params.roomId as string;

  useEffect(() => {
    if (roomId) {
      socket.emit("room:join", roomId);
      joinRoom(roomId);
    }

    return () => {
      socket.emit("room:leave", roomId);
      leaveRoom();
    };
  }, [roomId, joinRoom, leaveRoom]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Room: {roomId}</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelect />
          <ThemeToggle />
        </div>
      </div>
      <div className="flex-1 rounded-lg border bg-card">
        <CodeEditor />
      </div>
    </div>
  );
}
