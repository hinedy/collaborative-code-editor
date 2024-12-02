import { FileExplorer } from "@/components/editor/file-explorer"
import { CollaborationStatus } from "@/components/editor/collaboration-status"

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <FileExplorer />
      <div className="flex-1">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Collaborative Code Editor</h1>
            <CollaborationStatus />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}