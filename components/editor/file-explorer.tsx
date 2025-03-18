"use client";

import { useEffect, useState } from "react";

import { Plus } from "lucide-react";

import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/lib/database.types";

import { FileItem } from "./file-item";

export type FileNode = {
  id: string;
  name: string;
  type: Database["public"]["Enums"]["file_type"];
  language: Database["public"]["Enums"]["language"] | null;
  content: string | null;
  project_id: string | null;
  children: FileNode[];
};

export function FileExplorer({
  projectName,
}: {
  projectName: string | undefined;
}) {
  const params = useParams();
  const [files, setFiles] = useState<FileNode[]>([]);
  const [showNewRootInput, setShowNewRootInput] = useState(false);
  const [newRootName, setNewRootName] = useState("");
  const { toast } = useToast();
  const projectId = params.projectId as string;

  const loadFiles = async () => {
    const { data, error } = await supabase
      .from("files_tree_view")
      .select("data")
      .eq("project_id", projectId)
      .single();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
      // setLoading(false);
      return;
    }
    setFiles(data?.data);
    // setLoading(false);
  };
  useEffect(() => {
    if (projectId) {
      loadFiles();
    }
  }, [projectId]);

  const handleCreateRoot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRootName.trim()) return;
    const { error } = await supabase
      .from("files")
      .insert({ project_id: projectId, name: newRootName, type: "folder" });
    if (error) {
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
      return;
    }
    loadFiles();
    setShowNewRootInput(false);
    setNewRootName("");
  };

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="flex items-center justify-between border-b p-2">
        <h2 className="font-semibold">{projectName}</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNewRootInput(true)}
          >
            <Plus className="h-4 w-4" />
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

        {files?.map((file) => (
          <FileItem
            key={file.id}
            {...file}
            level={0}
            projectId={projectId}
            onUpdate={loadFiles}
          />
        ))}
      </div>
    </div>
  );
}
