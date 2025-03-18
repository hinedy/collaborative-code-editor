"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateProjectDialog } from "./create-project-dialog";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

export function ProjectList() {
  const { projects, setProjects } = useEditorStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .is("deleted_at", null);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    setProjects(data);
    setLoading(false);
  }
  const deleteProject = async (id: string) => {
    const date = new Date().toISOString();
    const { error } = await supabase
      .from("projects")
      .update({ deleted_at: date })
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
        description: "Item deleted",
        variant: "default",
      });
    }
    loadProjects();
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <CreateProjectDialog />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                {project.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Last updated {formatDistanceToNow(new Date(project.updated_at))}{" "}
                ago
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild>
                <Link href={`/editor/${project.id}`}>Open Project</Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteProject(project.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
