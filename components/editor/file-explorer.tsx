"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  Plus,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileItemProps {
  id: string;
  name: string;
  type: "file" | "folder";
  level: number;
  children?: Array<{ id: string; name: string; type: "file" | "folder" }>;
}

function FileItem({ id, name, type, level, children }: FileItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeFileId, setActiveFileId } = useEditorStore();

  const handleClick = () => {
    if (type === "folder") {
      setIsOpen(!isOpen);
    } else {
      setActiveFileId(id);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 p-1 rounded-md hover:bg-accent cursor-pointer",
          activeFileId === id && "bg-accent"
        )}
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={handleClick}
      >
        {type === "folder" ? (
          <>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <Folder className="h-4 w-4" />
          </>
        ) : (
          <>
            <File className="h-4 w-4" />
          </>
        )}
        <span className="text-sm">{name}</span>
      </div>
      {type === "folder" && isOpen && children && (
        <div>
          {children.map((child) => (
            <FileItem key={child.id} {...child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer() {
  const { files, sidebarOpen, setSidebarOpen, createFile } = useEditorStore();

  return (
    <div className="w-64 border-r bg-card h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between p-2 border-b">
        <h2 className="font-semibold">Files</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Plus
              className="h-4 w-4"
              onClick={(e) => {
                createFile(null, "new folder", "folder");
              }}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {files.map((file) => (
          <FileItem key={file.id} {...file} level={0} />
        ))}
      </div>
    </div>
  );
}
