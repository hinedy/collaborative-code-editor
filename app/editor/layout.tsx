"use client";
import { FileExplorer } from "@/components/editor/file-explorer";
import { CollaborationStatus } from "@/components/editor/collaboration-status";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <PanelGroup direction="horizontal">
        {" "}
        <Panel defaultSize={20} minSize={15} maxSize={40}>
          <FileExplorer />
        </Panel>
        <PanelResizeHandle className="w-1 bg-border transition-colors hover:bg-primary" />
        <Panel>
          <div className="flex-1">
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                  Collaborative Code Editor
                </h1>
                <CollaborationStatus />
              </div>
              {children}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
