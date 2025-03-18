"use client";

import { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  File,
  FilePlus,
  Folder,
  FolderPlus,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface FileItemProps {
  id: string;
  name: string;
  type: "file" | "folder";
  level: number;
  projectId: string;
  children?: Array<{ id: string; name: string; type: "file" | "folder" }>;
  onUpdate: () => void;
}

export function FileItem({
  id,
  name,
  type,
  level,
  projectId,
  children,
  onUpdate,
}: FileItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [itemType, setItemType] = useState<"file" | "folder" | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);
  const { activeFileId, setActiveFileId } = useEditorStore();
  const { toast } = useToast();

  const handleClick = () => {
    if (type === "folder") {
      setIsOpen(!isOpen);
    } else {
      setActiveFileId(id);
    }
  };

  const handleNewItem = (itemType: "file" | "folder") => {
    setItemType(itemType);
    setNewItemName("");
  };

  const handleSubmitNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const { error } = await supabase.from("files").insert({
      project_id: projectId,
      parent_id: id,
      name: newItemName,
      type: itemType,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
    }
    setItemType(null);
    setNewItemName("");
    onUpdate();
    if (type === "folder" && !isOpen) {
      setIsOpen(true);
    }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === name) {
      setIsRenaming(false);
      setNewName(name);
      return;
    }

    const { error } = await supabase
      .from("files")
      .update({ name: newName })
      .eq("id", id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to rename item",
        variant: "destructive",
      });
      setNewName(name);
    }
    setIsRenaming(false);
    onUpdate();
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("files")
      .update({ deleted_at: new Date() })
      .eq("id", id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Failed to delete item",
        variant: "default",
      });
    }
    onUpdate();
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

        {isRenaming ? (
          <form
            onSubmit={handleRename}
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-6 text-sm"
              autoFocus
              onBlur={() => {
                setIsRenaming(false);
                setNewName(name);
              }}
            />
          </form>
        ) : (
          <span className="flex-1 text-sm">{name}</span>
        )}

        {isHovered && (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            {type === "folder" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleNewItem("file")}
                >
                  <FilePlus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleNewItem("folder")}
                >
                  <FolderPlus className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsRenaming(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {itemType && (
        <form
          onSubmit={handleSubmitNewItem}
          className="pl-6"
          style={{ paddingLeft: `${(level + 1) * 12}px` }}
        >
          <Input
            size={1}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={`New ${itemType}`}
            className="h-7 text-sm"
            autoFocus
            onBlur={() => setItemType(null)}
          />
        </form>
      )}

      {type === "folder" && isOpen && children && (
        <div>
          {children.map((child) => (
            <FileItem
              key={child.id}
              {...child}
              level={level + 1}
              projectId={projectId}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
