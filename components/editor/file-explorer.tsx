"use client";

import { useState, useCallback } from "react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  Plus,
  FilePlus,
  FolderPlus,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel, PanelResizeHandle } from "react-resizable-panels";

interface FileItemProps {
  id: string;
  name: string;
  type: "file" | "folder";
  level: number;
  children?: Array<{ id: string; name: string; type: "file" | "folder" }>;
}

function FileItem({ id, name, type, level, children }: FileItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showNewItemInput, setShowNewItemInput] = useState<
    "file" | "folder" | null
  >(null);
  const [newItemName, setNewItemName] = useState("");
  const { activeFileId, setActiveFileId, createFile } = useEditorStore();

  const handleClick = () => {
    if (type === "folder") {
      setIsOpen(!isOpen);
    } else {
      setActiveFileId(id);
    }
  };

  const handleNewItem = (itemType: "file" | "folder") => {
    setShowNewItemInput(itemType);
    setNewItemName("");
  };

  const handleSubmitNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    createFile(type === "folder" ? id : null, newItemName, showNewItemInput!);
    setShowNewItemInput(null);
    setNewItemName("");
    if (type === "folder" && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "group flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-accent",
          activeFileId === id && "bg-accent",
        )}
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
        <span className="flex-1 text-sm">{name}</span>
        {type === "folder" && isHovered && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                handleNewItem("file");
              }}
            >
              <FilePlus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                handleNewItem("folder");
              }}
            >
              <FolderPlus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {showNewItemInput && (
        <form
          onSubmit={handleSubmitNewItem}
          className="pl-6"
          style={{ paddingLeft: `${(level + 1) * 12}px` }}
        >
          <Input
            size={1}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={`New ${showNewItemInput}`}
            className="h-7 text-sm"
            autoFocus
            onBlur={() => setShowNewItemInput(null)}
          />
        </form>
      )}

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
  const [showNewRootInput, setShowNewRootInput] = useState(false);
  const [newRootName, setNewRootName] = useState("");

  const handleCreateRoot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRootName.trim()) return;

    createFile(null, newRootName, "folder");
    setShowNewRootInput(false);
    setNewRootName("");
  };

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="flex items-center justify-between border-b p-2">
        <h2 className="font-semibold">Files</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNewRootInput(true)}
          >
            <Plus className="h-4 w-4" />
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
        {showNewRootInput && (
          <form onSubmit={handleCreateRoot} className="mb-2">
            <Input
              size={1}
              value={newRootName}
              onChange={(e) => setNewRootName(e.target.value)}
              placeholder="New folder"
              className="h-7 text-sm"
              autoFocus
              onBlur={() => setShowNewRootInput(false)}
            />
          </form>
        )}

        {files.map((file) => (
          <FileItem key={file.id} {...file} level={0} />
        ))}
      </div>
    </div>
  );
}
